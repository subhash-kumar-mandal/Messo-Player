// import { gsap } from "https://cdn.skypack.dev/gsap";
import {DataObject} from "../index.js"
export function Addbtn_hover(BTN) {

    BTN.addEventListener('mouseenter', () => {
        gsap.to(BTN, {
            background: "#3F3F3F",
            duration: 0.5,
            scale: 1.06,
            ease: "power2.out",
        })
    });

    BTN.addEventListener('mouseleave', () => {
        gsap.to(BTN, {
            background: "#2A2A2A",
            duration: 0.5,
            scale: 1,
            ease: "power2.out",
        })
    })
}

export function box_Hover(lists) {

    lists.forEach(Boxs => {

        Boxs.addEventListener('mouseenter', () => {

            gsap.to(lists, {
                background: '#0F0F0F',
                duration: 0.3,
                scale: 1,
                ease: "power2.out"
            })

            gsap.to(Boxs, {
                background: "#3F3F3F",
                duration: 0.3,
                scale: 1.05,
                ease: "power2.out"
            })


        })
        Boxs.addEventListener('mouseleave', () => {

            gsap.to(lists, {
                background: "#0F0F0F",
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            })


        })
    });
}



export function Plat_buttons(lists) {

    lists.forEach(btn => {

        btn.addEventListener('mouseenter', () => {

            gsap.to(lists, {
                duration: 0.3,
                scale: 1,
                ease: "power2.out"
            })

            gsap.to(btn, {
                duration: 0.3,
                scale: 1.2,
                ease: "power2.out"
            })


        })
        btn.addEventListener('mouseleave', () => {

            gsap.to(lists, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            })


        })
    });
}





export function Track_hoves(lists) {


    lists.forEach(btn => {

        btn.addEventListener('mouseenter', () => {

            // gsap.to(lists, {
            //     x: 10,
            //     duration: 0.3,
            //     scale: 1,
            //     boxShadow: 'none',
            //     ease: "power2.out"
            // })

            gsap.to(btn, {
                x: 10,
                duration: 0.3,
                scale: 1.01,
                // border: " 0.1px solid #FF005C",
                // boxShadow: "0 0px 10px rgba(255, 0, 144, 0.4)",
                ease: "power2.out"
            })


        })
        btn.addEventListener('mouseleave', () => {

            gsap.to(lists, {
                x: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            })
            
         

        })
    });
}


export function Skeleton_track_song(Insert_object) {
    const frag = document.createDocumentFragment();
    for (let i = 1; i <= 6; i++) {
        const div = document.createElement('div');
        div.classList.add('song-box-1');
        const div2 = document.createElement('div');
        div2.classList.add('current_play-1');
        const p = document.createElement('p');
        div.append(div2);
        div.append(p);
        frag.append(div);
    }

    Insert_object.innerHTML = '';
    Insert_object.append(frag);
}



export function ActiveSong(id){
 console.log(id)
  const song = document.querySelectorAll('.song-box');
  
  song.forEach(Element=>{
    Element.classList.remove('activ');
  });

  const play_div = document.getElementById(`${id}`);
  
  if(play_div){
    play_div.classList.add('activ');
    play_div.scrollIntoView({
        behavior:"smooth",
        block:"center"
    })
  }


}