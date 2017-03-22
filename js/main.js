
jQuery(document).ready(function ($) {
    //set animation timing
    var animationDelay = 2500,
        //loading bar effect
        barAnimationDelay = 3800,
        barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
        //letters effect
        lettersDelay = 50,
        //type effect
        typeLettersDelay = 150,
        selectionDuration = 500,
        typeAnimationDelay = selectionDuration + 800,
        //clip effect 
        revealDuration = 600,
        revealAnimationDelay = 1500;

    initHeadline();


    function initHeadline() {
        //insert <i> element for each letter of a changing word
        singleLetters($('.cd-headline.letters').find('b'));
        //initialise headline animation
        animateHeadline($('.cd-headline'));
    }

    function singleLetters($words) {
        $words.each(function () {
            var word = $(this),
                letters = word.text().split(''),
                selected = word.hasClass('is-visible');
            for (i in letters) {
                if (word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
                letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
            }
            var newLetters = letters.join('');
            word.html(newLetters).css('opacity', 1);
        });
    }

    function animateHeadline($headlines) {
        var duration = animationDelay;
        $headlines.each(function () {
            var headline = $(this);

            if (headline.hasClass('loading-bar')) {
                duration = barAnimationDelay;
                setTimeout(function () { headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
            } else if (headline.hasClass('clip')) {
                var spanWrapper = headline.find('.cd-words-wrapper'),
                    newWidth = spanWrapper.width() + 10
                spanWrapper.css('width', newWidth);
            } else if (!headline.hasClass('type')) {
                //assign to .cd-words-wrapper the width of its longest word
                var words = headline.find('.cd-words-wrapper b'),
                    width = 0;
                words.each(function () {
                    var wordWidth = $(this).width();
                    if (wordWidth > width) width = wordWidth;
                });
                headline.find('.cd-words-wrapper').css('width', width);
            };

            //trigger animation
            setTimeout(function () { hideWord(headline.find('.is-visible').eq(0)) }, duration);
        });
    }

    function hideWord($word) {
        var nextWord = takeNext($word);

        if ($word.parents('.cd-headline').hasClass('type')) {
            var parentSpan = $word.parent('.cd-words-wrapper');
            parentSpan.addClass('selected').removeClass('waiting');
            setTimeout(function () {
                parentSpan.removeClass('selected');
                $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
            }, selectionDuration);
            setTimeout(function () { showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);

        } else if ($word.parents('.cd-headline').hasClass('letters')) {
            var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
            hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
            showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

        } else if ($word.parents('.cd-headline').hasClass('clip')) {
            $word.parents('.cd-words-wrapper').animate({ width: '2px' }, revealDuration, function () {
                switchWord($word, nextWord);
                showWord(nextWord);
            });

        } else if ($word.parents('.cd-headline').hasClass('loading-bar')) {
            $word.parents('.cd-words-wrapper').removeClass('is-loading');
            switchWord($word, nextWord);
            setTimeout(function () { hideWord(nextWord) }, barAnimationDelay);
            setTimeout(function () { $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

        } else {
            switchWord($word, nextWord);
            setTimeout(function () { hideWord(nextWord) }, animationDelay);
        }
    }

    function showWord($word, $duration) {
        if ($word.parents('.cd-headline').hasClass('type')) {
            showLetter($word.find('i').eq(0), $word, false, $duration);
            $word.addClass('is-visible').removeClass('is-hidden');

        } else if ($word.parents('.cd-headline').hasClass('clip')) {
            $word.parents('.cd-words-wrapper').animate({ 'width': $word.width() + 10 }, revealDuration, function () {
                setTimeout(function () { hideWord($word) }, revealAnimationDelay);
            });
        }
    }

    function hideLetter($letter, $word, $bool, $duration) {
        $letter.removeClass('in').addClass('out');

        if (!$letter.is(':last-child')) {
            setTimeout(function () { hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
        } else if ($bool) {
            setTimeout(function () { hideWord(takeNext($word)) }, animationDelay);
        }

        if ($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
            var nextWord = takeNext($word);
            switchWord($word, nextWord);
        }
    }

    function showLetter($letter, $word, $bool, $duration) {
        $letter.addClass('in').removeClass('out');

        if (!$letter.is(':last-child')) {
            setTimeout(function () { showLetter($letter.next(), $word, $bool, $duration); }, $duration);
        } else {
            if ($word.parents('.cd-headline').hasClass('type')) { setTimeout(function () { $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200); }
            if (!$bool) { setTimeout(function () { hideWord($word) }, animationDelay) }
        }
    }

    function takeNext($word) {
        return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
    }

    function takePrev($word) {
        return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
    }

    function switchWord($oldWord, $newWord) {
        $oldWord.removeClass('is-visible').addClass('is-hidden');
        $newWord.removeClass('is-hidden').addClass('is-visible');
    }
});


jQuery(document).ready(function ($) {
    var visionTrigger = $('.cd-3d-trigger'),
        galleryItems = $('.no-touch #cd-gallery-items').children('li'),
        galleryNavigation = $('.cd-item-navigation a');

    //on mobile - start/end 3d vision clicking on the 3d-vision-trigger
    visionTrigger.on('click', function () {
        $this = $(this);
        if ($this.parent('li').hasClass('active')) {
            $this.parent('li').removeClass('active');
            hideNavigation($this.parent('li').find('.cd-item-navigation'));
        } else {
            $this.parent('li').addClass('active');
            updateNavigation($this.parent('li').find('.cd-item-navigation'), $this.parent('li').find('.cd-item-wrapper'));
        }
    });

    //on desktop - update navigation visibility when hovering over the gallery images
    galleryItems.hover(
        //when mouse enters the element, show slider navigation
        function () {
            $this = $(this).children('.cd-item-wrapper');
            updateNavigation($this.siblings('nav').find('.cd-item-navigation').eq(0), $this);
        },
        //when mouse leaves the element, hide slider navigation
        function () {
            $this = $(this).children('.cd-item-wrapper');
            hideNavigation($this.siblings('nav').find('.cd-item-navigation').eq(0));
        }
    );

    //change image in the slider
    galleryNavigation.on('click', function () {
        var navigationAnchor = $(this);
        direction = navigationAnchor.text(),
            activeContainer = navigationAnchor.parents('nav').eq(0).siblings('.cd-item-wrapper');

        (direction == "Next") ? showNextSlide(activeContainer) : showPreviousSlide(activeContainer);
        updateNavigation(navigationAnchor.parents('.cd-item-navigation').eq(0), activeContainer);
    });
});

function showNextSlide(container) {
    var itemToHide = container.find('.cd-item-front'),
        itemToShow = container.find('.cd-item-middle'),
        itemMiddle = container.find('.cd-item-back'),
        itemToBack = container.find('.cd-item-out').eq(0);

    itemToHide.addClass('move-right').removeClass('cd-item-front').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
        itemToHide.addClass('hidden');
    });
    itemToShow.addClass('cd-item-front').removeClass('cd-item-middle');
    itemMiddle.addClass('cd-item-middle').removeClass('cd-item-back');
    itemToBack.addClass('cd-item-back').removeClass('cd-item-out');
}

function showPreviousSlide(container) {
    var itemToMiddle = container.find('.cd-item-front'),
        itemToBack = container.find('.cd-item-middle'),
        itemToShow = container.find('.move-right').slice(-1),
        itemToOut = container.find('.cd-item-back');

    itemToShow.removeClass('hidden').addClass('cd-item-front');
    itemToMiddle.removeClass('cd-item-front').addClass('cd-item-middle');
    itemToBack.removeClass('cd-item-middle').addClass('cd-item-back');
    itemToOut.removeClass('cd-item-back').addClass('cd-item-out');

    //wait until itemToShow does'n have the 'hidden' class, then remove the move-right class 
    //in this way, transition works also in the way back
    var stop = setInterval(checkClass, 100);

    function checkClass() {
        if (!itemToShow.hasClass('hidden')) {
            itemToShow.removeClass('move-right');
            window.clearInterval(stop);
        }
    }
}

function updateNavigation(navigation, container) {
    var isNextActive = (container.find('.cd-item-middle').length > 0) ? true : false,
        isPrevActive = (container.children('li').eq(0).hasClass('cd-item-front')) ? false : true;
    (isNextActive) ? navigation.find('a').eq(1).addClass('visible') : navigation.find('a').eq(1).removeClass('visible');
    (isPrevActive) ? navigation.find('a').eq(0).addClass('visible') : navigation.find('a').eq(0).removeClass('visible');
}

function hideNavigation(navigation) {
    navigation.find('a').removeClass('visible');
}