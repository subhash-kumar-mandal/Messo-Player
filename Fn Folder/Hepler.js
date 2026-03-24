import { ActiveSong, Track_hoves, Skeleton_track_song } from './Effect.js'
import { DBSONGS, fack_songs, DataObject } from '../index.js'




// const Range_timeline = document.querySelector('.Timeline');
const Song_track_div = document.querySelector('.track-Songs');
const dle = document.querySelector('.dle-panel');
const Play_Audio = document.querySelector('#Player');
const middlebtn = document.querySelector('#main-play');
const set_img = document.querySelector('.play-img-song img');
const textset = document.querySelector('.information-song p');
const Range_timeline = document.querySelector('.Timeline');
const serach = document.querySelector('.input-search');
const add = document.querySelector('#add-file');
const file = document.querySelector('#click')
const subbtn = document.querySelector('#submitbtn');
const add_none = document.querySelector('.add-new-songs');
const song_name_add = document.querySelector('#set-name');
const img_song_add = document.querySelector("#save-song")
export function FILE_BUTTON() {
    add.addEventListener('click', () => {
        file.click();
    })
}

export function Name_check(name) {
    if (!name.trim() || name.trim().length < 1) {
        alert('enter valid name');
        return false;
    }
    return true;

}

export function File_validation(evt) {
    console.log(evt)
    const file = evt.files[0];
    if (evt.value == "") {
        alert('find file')
        return false;
    }
    let mp3 = file.name.endsWith('.mp3');
    let mpeg = file.name.endsWith('.mpeg');
    if (mpeg == false && mp3 == false) {
        alert("nhi lunga bhai");
        return false;
    };

    return true

};

export function btn_add() {
    subbtn.addEventListener('click', () => {
        let name = song_name_add.value;
        console.dir(file)
        let audio = file.files[0]
        let flag1 = Name_check(song_name_add.value)
        let flag2 = File_validation(file);
        let url = img_song_add.value;


        if (flag1 && flag2) {
            add.textContent = 'ADD FILE';
            Save_songs_user(DBSONGS, name, audio, url, true);
            song_name_add.value = '';
            file.value = '';
            img_song_add.value = '';
            add_none.style.display = 'none'

        }

    })
}



export function user_last_save() {
    if (!DBSONGS) {
        return;
    }
    const tx = DBSONGS.transaction("playerState", "readwrite");
    const store = tx.objectStore("playerState");

    const request = store.put({
        id: "playe",
        id_1: DataObject.id,
        name: DataObject.name,
        img: DataObject.img,
        // src: DataObject.CurrentBlobUrl,
        index: DataObject.index_Array,
        timeline_sync: DataObject.User_timeline
    });


    request.onsuccess = object => {
        // console.log(object.target)
    }
}



export function user_restore_song() {
    if (!DBSONGS) return;

    const tx = DBSONGS.transaction("playerState", "readonly");
    const store = tx.objectStore("playerState");
    const req = store.get('playe');
    req.onsuccess = event => {
        const data = event.target.result;
        console.log(data)
        if (!data) return;
        const some = fack_songs.some((object) => {
            return object.song_name.toLowerCase() === data.name.toLowerCase()

        })






        if (some) play_restore(data.index)
        Play_Audio.onloadedmetadata = () => {
            Play_Audio.currentTime = (data.timeline_sync / 100) * Play_Audio.duration

        }

    }

}
export function play_restore(index) {

    const song = fack_songs[index]

    if (!song) return  // toster hare ;

    if (DataObject.CurrentBlobUrl) {
        URL.revokeObjectURL(DataObject.CurrentBlobUrl)
    }

    DataObject.index_Array = index
    DataObject.id = song.id
    DataObject.name = song.song_name
    DataObject.img = song.img

    DataObject.CurrentBlobUrl = URL.createObjectURL(song.Blob)

    set_img.src = DataObject.img
    textset.textContent = DataObject.name

    Play_Audio.src = DataObject.CurrentBlobUrl;
    ActiveSong(DataObject.id)


}



export function playfn(audio, btn) {
    btn.classList.remove("ri-play-circle-fill");
    btn.classList.add("ri-pause-large-line");
    audio.play()
}
export function pausefn(audio, btn) {
    btn.classList.remove("ri-pause-large-line");
    btn.classList.add("ri-play-circle-fill");
    audio.pause()
}



export function Play_UI_Btn(Object, Main_Player) {

    Object.addEventListener('click', () => {
        if (DataObject.index_Array === undefined) {
            console.log("helo")
            return
        }
        if (!DataObject.CurrentBlobUrl) {
            console.log("nhi chlega");
            return
        }
        let check1 = Main_Player.paused;
        if (check1) {

            Object.classList.remove("ri-play-circle-fill");
            Object.classList.add("ri-pause-large-line");
            Main_Player.play()
        } else {
            Object.classList.remove("ri-pause-large-line");
            Object.classList.add("ri-play-circle-fill");
            Main_Player.pause()
        }
    })
}


export function timeline_sync(Main_Player, Timeline) {

    Main_Player.addEventListener("timeupdate", () => {
        if (!Main_Player.duration) {
            return;
        };
        const time = (Main_Player.currentTime / Main_Player.duration) * 100;
        DataObject.User_timeline = time;
        Timeline.value = time;
        // Timeline.style.setProperty("--progress", `${time}%`);

        user_last_save()

    })
};

export function Input_Sync(Main_Player, Timeline) {

    Timeline.addEventListener("input", () => {
        if (Main_Player.src === "") {
            Timeline.value = 0
        }
        if (!Main_Player.duration) return;
        let time = (Timeline.value / 100) * Main_Player.duration;
        if (Main_Player.duration) {
            Main_Player.currentTime = time
            user_last_save()
        }

    })
};

export function Save_songs_user(DB, song_name, audio, img, flag) {
    song_name = song_name.toLowerCase();

    if (!DB) {
        return;
    };

    const tx = DB.transaction("songs", "readwrite");
    const store = tx.objectStore("songs");

    let req = store.add({
        song_name,
        Blob: audio,
        img
    });

    req.onsuccess = event => {
        if (flag) {
            const Song_track_div = document.querySelector('.track-Songs');

            GetAll_song(DBSONGS, Song_track_div);
        };
    }
}

export async function Add_Songs_Defult(DB) {
    const Song_track_div = document.querySelector('.track-Songs');
    Skeleton_track_song(Song_track_div)
    if (!DB) return;

    const tx = DB.transaction("songs", "readonly");
    const store = tx.objectStore("songs");
    const countReq = store.count();

    countReq.onsuccess = async function () {
        if (countReq.result > 0) return;

        const songs = [
            { name: "babaji", path: './music/Baba_ji.mpeg', img: './music/babaji.png' },
            { name: "Rubicon drill", path: "./music/RubiconDrill.mpeg", img: "./music/Rubicon Drill.png" },
            { name: "Teeje week", path: "./music/TeejeWeek.mpeg", img: "./music/Teeje week.png" },
            { name: "Hassen", path: "./music/HASEEN.mpeg", img: "./music/Hassen.jpeg" },
            { name: "Khayaal", path: "./music/Khayaal.mpeg", img: "./music/Khayaal.jpeg" },
            { name: "Mera mann", path: "./music/Mera_Mann.mpeg", img: "./music/Mera mann.jpeg" },
            { name: "Sheesha", path: "./music/sheesha.mpeg", img: "./music/Sheesha.jpeg" },
            { name: "Safar", path: "./music/safar.mpeg", img: "./music/Safar.jpeg" },
            { name: "Rade it", path: "./music/ride it.mpeg", img: "./music/Ride.jpeg" },
            { name: "Kangna tere ni", path: "./music/KangnaTerani.mpeg", img: "./music/Kangana tera ni.jpeg" },




        ];

        for (let s of songs) {
            const res = await fetch(s.path);
            const blob = await res.blob();
            Save_songs_user(DB, s.name, blob, s.img);
        }


        GetAll_song(DB, Song_track_div)
    }
}



export function GetAll_song(DB, Div) {
    if (!DB) return;


    const tx = DB.transaction('songs', 'readonly');
    const store = tx.objectStore('songs');
    const array = store.getAll();

    array.onsuccess = (e) => {

        let songs = e.target.result;
        fack_songs.length = 0;
        fack_songs.push(...songs)
        const frag = document.createDocumentFragment();
        for (let val of songs) {

            const div = document.createElement('div');
            div.classList.add('song-box');
            div.id = val.id;


            const div2 = document.createElement('div');
            div2.classList.add('current_play');
            const img = document.createElement('img');
            img.src = val.img;
            div2.append(img);

            const p = document.createElement('p');
            p.textContent = val.song_name;
            div.append(div2);
            div.append(p);
            frag.append(div);
        }

        Div.innerHTML = '';
        if (Div.innerHTML === '') {
            const Song_track_div = document.querySelector('.track-Songs');
            Skeleton_track_song(Song_track_div)
        }
        setTimeout(()=>{
            Div.innerHTML = '';
            Div.append(frag)
        })
        // Div.append(frag)
        const songsBox = document.querySelectorAll(".song-box");
        Delete_box_render()
        Track_hoves(songsBox);

    }
};

// document.addEventListener("DOMContentLoaded", () => {
//     console.log("hello")
// })



export function playSong(index) {
    console.log(index)
    if (index == -1) {
        return;
    }
    const song = fack_songs[index]
    if (!song) return

    if (DataObject.CurrentBlobUrl) {
        URL.revokeObjectURL(DataObject.CurrentBlobUrl)
    }

    DataObject.index_Array = index
    DataObject.id = song.id
    DataObject.name = song.song_name
    DataObject.img = song.img
    DataObject.CurrentBlobUrl = URL.createObjectURL(song.Blob)

    set_img.src = DataObject.img
    textset.textContent = DataObject.name

    Play_Audio.src = DataObject.CurrentBlobUrl


    Play_Audio.addEventListener("loadedmetadata", () => {
        Play_Audio.currentTime = 0
        Range_timeline.value = 0
        DataObject.User_timeline = 0
    }, { once: true })

    ActiveSong(DataObject.id)

    playfn(Play_Audio, middlebtn)
}



export function NextBtn() {
    document.querySelector('#Nextbtn').addEventListener('click', () => {
        if (DataObject.index_Array === null || DataObject.index_Array === undefined) {
            console.log(DataObject)
            return
        }


        playSong(DataObject.index_Array + 1);
        user_last_save()

    })
}

export function BackBtn() {

    document.querySelector('#Backbtn').addEventListener('click', () => {

        playSong(DataObject.index_Array - 1)
        user_last_save()

    })
}


export function Play_user(array, parent) {

    parent.addEventListener('click', (e) => {
        let box = e.target.closest(".song-box");
        if (!box) return;
        if (box.id) {
            // Render_Click(array, Number(box.id))

            const index = array.findIndex(song => song.id == Number(box.id));

            if (index !== -1) {
                playSong(index)
            }

        }
    })
}

function serach_box(event) {

    if (!fack_songs) return;

    const query = event.target.value.toLowerCase();
    if (query === "") {
        document.querySelector(".search-suggestions").style.display = "none";
        return;
    }

    const song_filter = fack_songs.filter(val =>
        val.song_name.toLowerCase().includes(query)
    );

    if (song_filter.length === 0) {
        document.querySelector(".search-suggestions").style.display = "none";
        return;
    }

    console.log(song_filter);
    showSuggestions(song_filter)
}




function Debouce(fn, dealy) {
    let time;

    return (event) => {
        clearTimeout(time);
        time = setTimeout(() => {
            fn(event)
        }, dealy)
    }
}

const print = Debouce(serach_box, 500)

serach.addEventListener('input', print)


function showSuggestions(list) {

    const box = document.querySelector(".search-suggestions");
    const frag = document.createDocumentFragment();

    list.forEach(song => {

        const div = document.createElement("div");
        div.classList.add('box-serach');
        div.classList.add("suggestion");

        const p = document.createElement("p");
        p.textContent = song.song_name;

        const img = document.createElement("img");
        img.src = song.img;
        img.style.width = "40px";

        div.append(p, img);

        div.addEventListener("click", () => {
            playSong(fack_songs.findIndex(s => s.id === song.id))
            box.style.display = "none"
        });

        frag.append(div);

    });

    box.innerHTML = "";
    box.append(frag);
    box.style.display = "flex";
}


document.addEventListener("click", (e) => {

    const box = document.querySelector(".search-suggestions")

    if (!serach.contains(e.target) && !box.contains(e.target)) {

        box.innerHTML = ""
        box.style.display = "none"
        serach.value = ""

    }

})




export function Open_dle_panel() {

    const div = document.querySelector("#Dle");
    const dle = document.querySelector('.dle-panel')
    div.addEventListener('click', () => {
        if (dle.style.display === 'block') {
            dle.style.display = 'none';
        } else {
            dle.style.display = 'block';
        }
    })
}


export function Open_add_panel() {

    const div = document.querySelector("#Add-song")
    div.addEventListener('click', () => {
        console.log("hello")
        if (add_none.style.display === 'block') {
            add_none.style.display = 'none';
            add.textContent = 'ADD FILE';
            song_name_add.value = '';
            file.value = '';
            img_song_add.value = '';

        } else {
            add_none.style.display = 'block';
        }
    })
}


export function Open_crete_panel() {

    const div = document.querySelector(".add-song")
    div.addEventListener('click', () => {
        console.log("hello")
        if (add_none.style.display === 'block') {
            add_none.style.display = 'none';
            add.textContent = 'ADD FILE';
            song_name_add.value = '';
            file.value = '';
            img_song_add.value = '';

        } else {
            add_none.style.display = 'block';
        }
    })
}
export function dle_song_id(id) {
    if (!DBSONGS) return;

    const tx = DBSONGS.transaction('songs', 'readwrite');
    const store = tx.objectStore('songs');

    store.delete(id);

    tx.oncomplete = () => {


        if (DataObject.id === id) {
            DataObject.index_Array = null;
            DataObject.id = null
            DataObject.name = null
            DataObject.img = null
            DataObject.CurrentBlobUrl = null;
            DataObject.index_Array = null
            set_img.src = '';
            Play_Audio.src = ""
            Range_timeline.value = 0
            textset.textContent = "Choice the Song"
            middlebtn.classList.remove("ri-pause-large-line");
            middlebtn.classList.add("ri-play-circle-fill");

        }

        GetAll_song(DBSONGS, Song_track_div)

    }

}


function Delete_box_render() {
    const frag = document.createDocumentFragment();

    for (let object of fack_songs) {
        const main_box = document.createElement('div');
        main_box.classList.add('box-delete');
        main_box.id = `${object.id}box`;
        const img = document.createElement('img');
        img.src = object.img;
        img.alt = object.song_name + "song";
        const p = document.createElement('p');
        p.textContent = object.song_name;
        const button = document.createElement('button');
        button.textContent = "Delete"
        main_box.append(img, p, button);
        frag.append(main_box)
    };
    dle.innerHTML = '';
    dle.append(frag)
}


export function Dle_song() {

    dle.addEventListener('click', (e) => {
        const button = e.target;
        if (button.nodeName === "BUTTON") {
            const close = e.target.closest('.box-delete');
            const id = parseInt(close.id);
            console.log(id)
            dle_song_id(id)
        }

    })
}


