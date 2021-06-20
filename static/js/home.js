/**
 * Function to animate the Counter when scrolls over the div
 */

// Execute animation when user comes close to div
const elementPosition = $('.courses').offset().top;
let ready = true;

$(window).on('scroll', function() {
    const yScrollPos = window.pageYOffset;
    const scrollPostTest = elementPosition;

    if (ready && yScrollPos > scrollPostTest) {
        ready = false;
        $('.count').each(function() {
            $(this).prop('Counter', 0).animate({
                Counter: $(this).text().replace('+', ''),
            }, {
                duration: 3000,
                easing: 'swing',
                step: function(now) {
                    $(this).text(Math.ceil(now) + '+');
                },
            });
        });
    }
});

