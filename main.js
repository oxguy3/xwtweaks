(function() {
    'use strict';

    // for list of key names, see https://developer.mozilla.org/docs/Web/API/KeyboardEvent/key/Key_Values
    const pencilKeys = ['Shift'];
    const pauseKeys = ['`'];

    /**
     * Toggles pencil mode when a certain key is held
     *
     * @param {KeyboardEvent} event
     * @param {string} pencilSelector CSS selector for the pencil button
     * @param {string} activeClass name of a class that the pencil button will
     * have if it's active
     */
    function pencilToggle(event, pencilSelector, activeClass) {
        if (pencilKeys.includes(event.key) && ['keydown', 'keyup'].includes(event.type)) {
            const desiredState = event.type == 'keydown';
            const pencil = document.querySelector(pencilSelector);
            if (pencil && pencil.classList.contains(activeClass) != desiredState) {
                pencil.click();
            }
        }
    }

    /**
     * Toggle the game being paused when a certain key is pressed
     *
     * @param {KeyboardEvent} event
     * @param {String} pauseSelector - CSS selector for the pause button
     * @param {String} resumeSelector - CSS selector for the resume button
     * @param {String} isPausedSelector - CSS selector for some element that
     * will only exist in the DOM while the game is paused
     */
    function pauseToggle(event, pauseSelector, resumeSelector, isPausedSelector) {
        if (pauseKeys.includes(event.key)) {
            if (event.type == 'keydown') {
                const isPaused = document.querySelector(isPausedSelector) != null;
                const pause = document.querySelector(pauseSelector);
                const resume = document.querySelector(resumeSelector);

                if (!isPaused && pause != null) {
                    pause.click();
                } else if (isPaused && resume != null) {
                    resume.click();
                } else {
                    console.error(
                        "Game appears to be %s, but there's no %s button!",
                        isPaused ? 'paused' : 'not paused',
                        isPaused ? 'resume' : 'pause'
                    );
                    return;
                }
            }
            // prevent character from being inserted into the game
            event.stopImmediatePropagation();
        }
    }
    const games = [
        {
            name: 'Vertex',
            href: '/puzzles/vertex'
        },
        {
            name: 'Spelling Bee',
            href: '/puzzles/spelling-bee'
        },
        {
            name: 'Letter Boxed',
            href: '/puzzles/letter-boxed'
        },
        {
            name: 'Tiles',
            href: '/puzzles/tiles'
        },
        {
            name: 'Sudoku',
            href: '/crosswords/game/sudoku'
        },
        {
            name: 'SET®',
            href: '/puzzles/set'
        },
        {
            name: 'KenKen®',
            href: '/puzzles/kenken'
        }
    ];

    /** add links to other games to navbar */
    window.addEventListener('load', function () {
        let navItem = document.createElement('a');
        navItem.className = 'ExpandedNav-navItem--199L1 ExpandedNav-links--2t4yu pz-nav__link xwt-nav-games';
        navItem.href = '#';
        navItem.innerHTML = '<span>Games</span>';

        let dropdown = document.createElement('div');
        dropdown.className = 'xwt-nav-dropdown';
        let drawer = document.querySelector('.NavDrawer-navDrawer--C7FP5 nav');
        for (const game of games) {
            let dropdownLink = document.createElement('a');
            dropdownLink.innerText = game.name;
            dropdownLink.href = game.href;
            dropdown.append(dropdownLink);

            if (drawer != null) {
                let drawerLink = dropdownLink.cloneNode(true);
                drawerLink.className = 'NavDrawer-navItem--nMB9J NavDrawer-link--35EiX';
                drawer.append(drawerLink);
            }
        }
        navItem.append(dropdown);
        document.querySelector('.ExpandedNav-expandedNav--16RdJ, .pz-nav__actions').prepend(navItem);
    });

    if (window.location.pathname.match(/^\/crosswords\/game\/(daily|variety|bonus)/gi)) {
        // CROSSWORD GAME

        /** shortcut key listeners */
        function crosswordKeyHandler(event) {
            pencilToggle(event, '.Icon-pencil--1cTxu', 'Icon-pencil-active--1lOAS');
            pauseToggle(event, '.Timer-button--Jg5pv>button', '.buttons-modalButton--1REsR', '.buttons-modalButton--1REsR');
        }
        window.addEventListener('keydown', crosswordKeyHandler, true);
        window.addEventListener('keyup', crosswordKeyHandler, true);
        window.addEventListener('keypress', crosswordKeyHandler, true);

        /** remove hover text on crossword board */
        window.addEventListener('load', function () {
            let boardTitle = document.getElementById('boardTitle');
            boardTitle.parentNode.removeChild(boardTitle);
        });

    } else if (window.location.pathname.startsWith("/puzzles/acrostic/")) {
        // ACROSTIC GAME

        /** shortcut key listeners */
        function acrosticKeyHandler(event) {
            pencilToggle(event, '.pencil-mode-toggle', 'pencil');
            pauseToggle(event, '.pause-button', '#pzm-pause button.review-button', '#portal-game-modals.pzm-active');
        }
        window.addEventListener('keydown', acrosticKeyHandler, true);
        window.addEventListener('keyup', acrosticKeyHandler, true);
        window.addEventListener('keypress', acrosticKeyHandler, true);

    } else if (window.location.pathname.match(/^\/crosswords\/?$/gi)) {
        // CROSSWORD HOME PAGE

        /** remove "how to solve" promo card and replace with much smaller link */
        window.addEventListener('load', function() {
            let solveSection = document.querySelector('.PromoCard-promoSection--hyr3n').parentNode.parentNode;
            console.assert(solveSection.classList.contains('Section-section--2YfV5'));
            solveSection.style.display = "none";

            let solveLink = document.createElement('a');
            solveLink.className = 'WordplayLink-wordplayLink--2f9O0';
            solveLink.innerHTML = 'How to Solve The <span class="xwt-hidden-sm">New York Times </span>Crossword';
            solveLink.href = 'https://www.nytimes.com/guides/crosswords/how-to-solve-a-crossword-puzzle';
            document.querySelector('.Welcome-promotedLinks--3B_9r').append(solveLink);
        });

    } else if (window.location.pathname.match(/^\/puzzles\/stats\/?$/gi)) {
        // CROSSWORD STATS PAGE

        /** allow the user to de-select active day */
        const days = document.querySelectorAll('.single-day');
        for (const day of days) {
            day.addEventListener('click', function(event) {
                const activeDay = document.querySelector('.single-day.active');

                (activeDay != null) && activeDay.classList.remove('active');
                (activeDay != this) && this.classList.add('active');

                // prevent NYT's click handler from running
                event.stopImmediatePropagation();
            }, true);
        }

    } else if (window.location.pathname.match(/^\/puzzles\/spelling-bee\/?$/gi)) {
        // SPELLING BEE GAME

        /** shade letters in current word */
        window.addEventListener('load', function () {
            const hiveCells = document.querySelectorAll('.hive-cell');

            function updateCellColors() {
                const inputField = document.querySelector('.sb-hive-input-content.non-empty:not(.has-error)');
                const currentInput = (inputField != null) ? inputField.innerText.trim().toLowerCase() : '';
                for (const cell of hiveCells) {
                    const letter = cell.textContent.trim().toLowerCase();
                    console.assert(letter.length == 1);

                    const isCenter = cell.classList.contains('center');
                    let color = isCenter ? '#f8cd05' : '#e6e6e6';
                    if (currentInput.indexOf(letter) != -1) {
                        color = isCenter ? '#e5bd05' : '#c9c9c9';
                    }
                    cell.querySelector('.cell-fill').style.fill = color;
                }
            }
            window.addEventListener('keydown', updateCellColors);

            const mouseDownElements = document.querySelectorAll('.hive-cell .cell-fill, .hive-action');
            for (const elem of mouseDownElements) {
                elem.addEventListener('touchdown', updateCellColors);
                elem.addEventListener('mousedown', function(event) {
                    updateCellColors();

                    // fix for NYT bug where all clicks are treated like right clicks
                    (event.button == 0) || event.stopImmediatePropagation();
                }, true);
            }
        });
    } else if (window.location.pathname.match(/^\/crosswords\/game\/sudoku\/?/gi)) {
        // SUDOKU GAME

    } else if (window.location.pathname.match(/^\/puzzles\/set\/?$/gi)) {
        // SET GAME

    } else if (window.location.pathname.match(/^\/puzzles\/vertex\/?$/gi)) {
        // VERTEX GAME

    }
})();
