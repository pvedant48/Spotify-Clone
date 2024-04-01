let currentSong = new Audio()
currentSong.volume = 0.35
let songs
let currFolder

function convertSecondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0)
        return "00:00"
    let minutes = Math.floor(seconds / 60);
    let extraSeconds = Math.floor(seconds % 60);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    extraSeconds = extraSeconds < 10 ? "0" + extraSeconds : extraSeconds;
    return minutes + ":" + extraSeconds;
}

async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`/songs/${currFolder}/`)
    let response = await a.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[1].split(".mp3")[0])
        }
    }
    let songUL = document.querySelector(".playlists").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" width="28" src="images/svgs/music.svg" alt="">
        <div class="info flex">
            <div> ${song.replaceAll("%20", " ")}</div>
        </div>
        </li>`;
    }

    Array.from(document.querySelector(".playlists").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", ele => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim() + ".mp3")
        })

    })
}

const playMusic = (track, paused = false) => {
    currentSong.src = `/songs/${currFolder}/` + track
    if (!paused) {
        currentSong.play()
        play_pause.src = "images/svgs/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

}

async function main() {
    await getSongs("1/")

    playMusic(songs[0] + ".mp3", true)

    play_pause.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play_pause.src = "images/svgs/pause.svg"
        }
        else {
            currentSong.pause()
            play_pause.src = "images/svgs/playbutton.svg"
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)}/${convertSecondsToMinutesAndSeconds(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = (percent * currentSong.duration) / 100
    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0
    })

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split(`${currFolder}`)[1].split(".mp3")[0])
        
        if (index - 1 >= 0) {
            playMusic(songs[index - 1] + ".mp3", false)
        }
    })

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split(`${currFolder}`)[1].split(".mp3")[0])
        
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1] + ".mp3", false)
        }
    })

    document.querySelector(".range").addEventListener("change", (e) => {
        currentSong.volume = e.target.value / 100
    })

    document.querySelector(".range").addEventListener("drag", () => {
        document.querySelector(".range").style.cursor = "grabbing"
    })

    Array.from(document.getElementsByClassName("card")).forEach((e) => {
        e.addEventListener("click", async (here) => {
            await getSongs(here.currentTarget.dataset.folder + "/")
            playMusic(songs[0] + ".mp3")
        })
    })
}

main()
