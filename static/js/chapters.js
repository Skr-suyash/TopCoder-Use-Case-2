/**
 * Small JS File to guide the users to differemt chapters
 */

$('.custom-card').on('click', function() {
    const index = $('.custom-card').index(this) + 1;
    window.location = window.location.href + '/' + index;
});
