
import {  Addbtn_hover, box_Hover, Plat_buttons, Skeleton_track_song } from './Fn Folder/Effect.js'
import {Open_crete_panel,Open_add_panel, btn_add, FILE_BUTTON,Dle_song, Open_dle_panel, user_restore_song, BackBtn, NextBtn, Play_UI_Btn, timeline_sync, Input_Sync, Add_Songs_Defult, GetAll_song, Play_user } from './Fn Folder/Hepler.js';

export let DataObject = {
    id: null,
    name: null,
    img: null,
    CurrentBlobUrl: null,
    index_Array: null,
    User_timeline: 0
};
export let fack_songs = []
export let DBSONGS;


const Addbtn = document.querySelector('.add-song');
const Box_hover = document.querySelectorAll('.side-box');
const play_btns = document.querySelectorAll('.plbtn');
const Play_Audio = document.querySelector('#Player');
const Middle_btn = play_btns[1];
const Range_timeline = document.querySelector('.Timeline');
const Track_song_hoves = document.querySelectorAll(".song-box");
const Song_track_div = document.querySelector('.track-Songs');

const request = indexedDB.open("SONGS", 2);
request.onupgradeneeded = (Object) => {
    const database = Object.target.result;
    if (!database.objectStoreNames.contains('songs')) {
        database.createObjectStore('songs', {
            keyPath: "id",
            autoIncrement: true
        });
    };
    if (!database.objectStoreNames.contains('playerState')) {
        database.createObjectStore('playerState', { keyPath: "id" });
    }
};

request.onsuccess = async (object) => {
    DBSONGS = object.target.result;
    Skeleton_track_song(Song_track_div)
    Add_Songs_Defult(DBSONGS);
    GetAll_song(DBSONGS, Song_track_div);
    user_restore_song()
}
// console.log(DataObject)


Addbtn_hover(Addbtn);
box_Hover(Box_hover);
Plat_buttons(play_btns);
Skeleton_track_song(Song_track_div)


Play_UI_Btn(Middle_btn, Play_Audio);
timeline_sync(Play_Audio, Range_timeline);
Input_Sync(Play_Audio, Range_timeline);


BackBtn()
NextBtn()
Open_dle_panel();
Dle_song()


Play_user(fack_songs, Song_track_div)



FILE_BUTTON()
btn_add()
Open_add_panel()
Open_crete_panel()