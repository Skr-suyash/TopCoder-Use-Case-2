
// Insert a new sticky Note
const create = document.getElementById('create');
create.addEventListener('click', function() {
    document.getElementById('create').insertAdjacentHTML('beforebegin',
        '<textarea></textarea>');
});

// Handle the download PDF
$('#download').on('click', function() {
    // Send notes download data to analytics
    gtag('event', 'NOTES_MADE', {
        'event_category': 'NOTES_MADE',
    });

    html2canvas(document.querySelector('#capture')).then((canvas) => {
        const image = canvas.toDataURL('image/png');
        // Create a canvas object for whole body
        $('.loader').show();
        // Send base64 encoded data to server
        $.ajax({
            type: 'POST',
            url: '/whiteboard/download',
            data: {
                imgBase64: image,
            },
            success: function(data) {
                $('.loader').hide();
                window.location = '/whiteboard/download/' + data;
            },
        });
    });
});
