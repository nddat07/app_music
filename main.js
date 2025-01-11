const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const player = $('.player')
const heading = $('.player h2')
const headings = $('.player h6')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const pauseBtn = $('.player.playing')
const progress = $('.progress')
const btnNext = $('.btn-next')
const btnPrev = $('.btn-prev')
const cd = $(".cd")
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const ListSong = $('.playlist')


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Để Anh Lương Thiện',
            singer: 'HUY PT REMIX',
            path: './accest/music/song1.mp3.mp3',
            image: './accest/img/anh.pnj.jpg',
        },
        {
            name: 'Forget About Her',
            singer: 'Nam Duck Remix',
            path: './accest/music/song2.mp3.mp3',
            image: './accest/img/song2.png.png',
        },
        {
            name: 'Thế Là Anh Bỏ Lỡ Chuyến Xe Cuộc Đời Remix',
            singer: 'Thanh Hưng x Domino Remix',
            path: './accest/music/song3.mp3.mp3',
            image: './accest/img/song3.png.png',
        },
        {
            name: 'Homesick',
            singer: 'Syrex',
            path: './accest/music/song4 - Nightcore  Homesick  Lyrics.mp3',
            image: './accest/img/meme.jpg',
        },
        {
            name: 'The River',
            singer: 'syrex',
            path: './accest/music/song5 - Nightcore  The River  Lyrics.mp3',
            image: './accest/img/nahida.jpg',
        },
        {
            name: 'DON\'T CÔI x COLD DON\'T',
            singer: ' VH REMIX',
            path: './accest/music/song6 - DONT CÔI x COLD DONT  VH REMIX   LYRICS  REVERD  NHẠC HOT TIK TOK MỚI NHẤT.mp3',
            image: './accest/img/noel.jpg',
        },
        {
            name: 'Bánh Mì Sữa Bò',
            singer: 'Dương Tử',
            path: './accest/music/song7 - banh mi sua bo.mp4',
            image: './accest/img/namcuti.jpg',
        },
        {
            name: 'Thế Là Anh Bỏ Lỡ Chuyến Xe Cuộc Đời Remix',
            singer: 'Thanh Hưng x Domino Remix',
            path: './accest/music/song3.mp3.mp3',
            image: './accest/img/song3.png.png',
        },
    ],

    render: function () {
       const htmls = this.songs.map((song, index) => {
        return `
          <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
        `
       })
       ListSong.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'CurrentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvent: function() {
        const _this = this

        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        const cdWidth = cd.offsetWidth
        document.onscroll = function() {
 
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newImageWidth = cdWidth - scrollTop

            cd.style.width = newImageWidth + 'px'
            cd.style.opacity = newImageWidth / cdWidth
        }

        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        audio.ontimeupdate = function() {
            if(this.duration) {
                const progressPercent = Math.round(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        btnNext.onclick = function() {
            if (_this.isRandom) {
                _this.RandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActive()
        }
        btnPrev.onclick = function() {
            if (_this.isRandom) {
                _this.RandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActive()
        }

        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                btnNext.click()
            }
        }

        btnRandom.onclick = function() {
            _this.isRandom = !_this.isRandom
            btnRandom.classList.toggle('active', _this.isRandom)
        }

        btnRepeat.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            btnRepeat.classList.toggle('active', _this.isRepeat)
        }

        ListSong.onclick = function(e) {
            const songNote = e.target.closest('.song:not(.active)')
            if(songNote || e.target.closest('.option')) {
                if(songNote) {
                    _this.currentIndex = Number(songNote.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },

    scrollToActive: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "center",
            })
        }, 200)
    },

    loadCurrentSong: function() {
        headings.textContent = this.CurrentSong.singer
        heading.textContent = this.CurrentSong.name
        cdThumb.style.backgroundImage = `url('${this.CurrentSong.image}')`
        audio.src = this.CurrentSong.path
    },


    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    RandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
            this.currentIndex = newIndex
            this.loadCurrentSong()
    },
    
    start: function () {
        this.defineProperties()
        this.handleEvent()
        this.loadCurrentSong()
        this.render()
    }
}

app.start()






