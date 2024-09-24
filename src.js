console.log('Coded by Mr Bhuvan Bhattarai');

let currentSong = new Audio();

let songs;
let currFolder;

async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    console.log(response);
    let div = document.createElement('div');
    div.innerHTML = response;
    let as = div.getElementsByTagName('a');
    // console.log(as)
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];

        if (element.href.endsWith('.mp3')) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }

    let songUl = document
        .querySelector('.librarymain')
        .getElementsByTagName('ul')[0];
    songUl.innerHTML = '';
    for (const song of songs) {
        let start = song.indexOf('-');
        let artist = song.slice(start);
        let xyz = artist.replaceAll('%20', ' ');
        let zyx = xyz.replaceAll('.mp3', ' ');

        songUl.innerHTML =
            songUl.innerHTML +
            ` <li>
                            <div class="musicimg">
                                <img src="music.svg" alt="" class="musicthumbnail">
                            </div>
                            
                            <div class="musicinfo">
                                <div class="name">${song.replaceAll(
                                    '%20',
                                    ' '
                                )}</div>
                                <div class="artistname">${zyx}</div>
                            </div>
                            <div class="musicplay">
                                <div class="play1">Play Now</div>
                                <svg class="musicplaysymbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                    width="25" height="25" color="#000000" fill="none">
                                    <path
                                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                        stroke="#898984" stroke-width="1.5" stroke-linejoin="round"></path>
                                </svg>
                            </div>
                        
                        </li>`;
    }

    Array.from(
        document.querySelector('.librarymain').getElementsByTagName('li')
    ).forEach((e) => {
        e.addEventListener('click', (elements) => {
            playMusic(
                e.querySelector('.musicinfo').firstElementChild.innerHTML.trim()
            );
        });
    });
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
    }
    document.querySelector('.playingSongInfo').innerHTML = decodeURI(track);
    document.querySelector('.songTime').innerHTML = '00:00/00:00';
};

function convertSecondsToMinSec(seconds) {
    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad minutes and seconds with leading zeros if necessary
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // Combine minutes and seconds into the desired format
    return `${formattedMinutes}:${formattedSeconds}`;
}

//This function is not working
async function displayAlbums(folder) {
    let response = await fetch(`http://127.0.0.1:5500/${folder}`);
    let responseText = await response.text();
    let playlist1 = document.querySelector('.rightmain');
    console.log(response, 'displayalbums');
    let div = document.createElement('div');
    div.innerHTML = responseText;

    let anchor = div.getElementsByTagName('a');
    let array = Array.from(anchor);
    console.log(anchor);
    playlist1.innerHTML = ' ';

    let albumResponse = await fetch(
        `http://127.0.0.1:5500/${folder}/info.json`
    );
    let albumInfo = await albumResponse.json();

    albumInfo.forEach((songs) => {
        playlist1.innerHTML += `<div data-folder="${folder}" class="playlist1">
                            <img src="/${folder}/cover.jpg" alt="img">
                            <p class="p1"> ${songs.title}</p>
                            <p class="p2">${songs.description}</p>
                            <div class="playbutton">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="25" height="25"
                                    color="#000000" fill="#000000">
                                    <path
                                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                        stroke="#000000" stroke-width="1.5" stroke-linejoin="round" />
                                </svg>

                            </div>
                        </div>`;
    });

    Array.from(document.getElementsByClassName('playlist1')).forEach((e) => {
        e.addEventListener('click', async (item) => {
            songs = await getsongs(
                `songs/${item.currentTarget.dataset.folder}`
            );
            // console.log(item.currentTarget.dataset)
        });
    });
}

async function main() {
    await getsongs('songs/ncs');
    // console.log(songs)
    playMusic(songs[0], true);

    // })
    Array.from(
        document.querySelector('.librarymain').getElementsByTagName('li')
    ).forEach((e) => {
        e.addEventListener('click', (elements) => {
            let play = document.querySelector('.play');
            play.src = 'paused.svg';
        });
    });
    let play = document.querySelector('.play');
    //for play netx pause
    play.addEventListener('click', () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = 'paused.svg';
        } else {
            currentSong.pause();
            play.src = 'play.svg';
        }
    });

    //listen for time update
    currentSong.addEventListener('timeupdate', () => {
        // console.log(currentSong.currentTime, currentSong.duration)

        const currentTime = Math.floor(currentSong.currentTime);
        const duration = Math.floor(currentSong.duration);
        document.querySelector(
            '.songTime'
        ).innerHTML = `${convertSecondsToMinSec(
            currentTime
        )}/${convertSecondsToMinSec(duration)}`;

        document.querySelector('.circle').style.left =
            (currentTime / duration) * 98 + '%';
    });
    document.querySelector('.line').addEventListener('click', (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 98;
        document.querySelector('.circle').style.left = percent + '%';
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.left').style.left = '0';
    });
    document.querySelector('.close').addEventListener('click', () => {
        document.querySelector('.left').style.left = '-500%';
    });

    //add  previous listener
    document.querySelector('.playprevious').addEventListener('click', () => {
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);

        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    //add  next listener
    document.querySelector('.playnext').addEventListener('click', () => {
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);

        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });
    // add volume
    document.querySelector('.volume-control').addEventListener('input', (e) => {
        // The slider value ranges from 0 to 100, so divide by 100 to get a value between 0 and 1
        currentSong.volume = parseFloat(e.target.value) / 100;
    });
    //load the playlist
}

displayAlbums('songs/ncs');
main();
