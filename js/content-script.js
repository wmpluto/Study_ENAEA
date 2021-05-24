current_page = location.href;

var timerQueue = [];

WT_MS_POLL = 30*1000
GAP_MS = 5*60*1000

GAP_F_MS = 5*1000
GAP_S_MS = 10*1000

function getClassId(s) {
    var args = {}
    var search = decodeURIComponent(s)
    if(search.indexOf('?') != -1){
      var text = search.substring(1+search.indexOf('?'))
      var json = text.split('&')
      json.forEach(element => {
        args[element.split('=')[0]] = element.split('=')[1]
      });
    }

    return args["courseId"]
}

function clearAlltimer() {
    console.log("clear all timer");

    for (i = timerQueue.length-1; i >= 0; i--) {
        clearTimeout(timerQueue[i]);
    }
    timerQueue = []
}

function startStudy() {
    console.log("start study");
    clearAlltimer();

    chrome.storage.local.get(['links'], function (result) {
        var r = result.links;

        line = document.getElementsByClassName("odd");
        for (i = 0; i < line.length; i++) {
            element = line[i];

            title = element.cells[0].textContent;
            time = element.cells[1].textContent;
            progress = element.cells[4].textContent
            url = "https://study.enaea.edu.cn/" + element.cells[5].querySelector("td.last-cell.text-center > a").getAttribute("data-vurl");
            html = element.cells[5].querySelector("td.last-cell.text-center > a");
            id = getClassId(url);

            r[id] = {'title': title, 'time': time, 'progress': progress, 'url': url, "html": html};
        }

        line = document.getElementsByClassName("even");
        for (i = 0; i < line.length; i++) {
            element = line[i];

            title = element.cells[0].textContent;
            time = element.cells[1].textContent;
            progress = element.cells[4].textContent
            url = "https://study.enaea.edu.cn/" + element.cells[5].querySelector("td.last-cell.text-center > a").getAttribute("data-vurl");
            html = element.cells[5].querySelector("td.last-cell.text-center > a");
            id = getClassId(url);

            r[id] = {'title': title, 'time': time, 'progress': progress, 'url': url, "html": html};
        }

        console.log(r)
        // store the arrary to local storage
        chrome.storage.local.set({ links: r }, function () {
        });
    });

    setTimeout(function(){
        chrome.storage.local.get(['links'], function (result) {
            var local_storage = result['links'];
    
            waitTime = GAP_F_MS;
            buttonList = document.getElementsByClassName("golearn  ablesky-colortip  saveStuCourse")

            for (i = 0; i < buttonList.length; i++) {
                a = buttonList[i];
                aId = getClassId(a.getAttribute("data-vurl"));

                if(local_storage[aId]["progress"] == "0%") { 
                    console.log(local_storage[aId]["title"]);
   
                    timer = setTimeout(function (ab) {
                        console.log("new tab");
                        console.log(ab);
                        ab.click();
                    }, Math.floor(waitTime), a);
    
                    timerQueue.push(timer);

                    time = local_storage[aId]['time'].split(":")
                    miliseconds = 1000 * (time[0]*3600 + time[1]*60 + time[2]*1);
                    waitTime = waitTime + miliseconds + GAP_MS + GAP_MS*Math.random();
                }
            }
        });
    }, GAP_S_MS);
}

if (current_page.indexOf('viewerforccvideo') > 0) {
    console.log(current_page);

    /* Get Class ID*/
    classId =  getClassId(current_page);
    console.log(classId);

    setTimeout(function () {
        video = document.getElementsByTagName("video")[0];
        if(video.paused) {
            console.log("play video")
            video.muted = true
            video.play();
        }
    }, GAP_S_MS);

    /* rm 20min warning*/
    var autoClick=setInterval(function(){
        document.getElementsByClassName("dialog-button-container")[0].querySelector("button").click();
    },WT_MS_POLL);

    chrome.storage.local.get(['links'], function (result) {
        const element = result.links[classId];

        console.log(element['time']);
        console.log(element['progress']);

        time = element['time'].split(":")
        miliseconds = 1000 * (time[0]*3600 + time[1]*60 + time[2]*1);
        /* close when ended 
       setTimeout(function () {
            window.close();
        }, miliseconds + GAP_MS);*/
    });
} else if (current_page.indexOf('circleIndexRedirect') > 0) {
    console.log(current_page);

    div = document.querySelector("#J_tabsContent > div > div.customcur-filter.clearfix > div");
    div.innerHTML = div.innerHTML + "<button id='startST'>点击开始</button><button id='clearAT'>点击关闭</button>";

    startButton = document.getElementById("startST");
    startButton.onclick = function() {
        startStudy();
    };

    clearButton = document.getElementById("clearAT");
    clearButton.onclick = function() {
        clearAlltimer();
    };
}