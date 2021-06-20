/* eslint-disable max-len */
/**
 * Utility file for creating an embedded PDF VIewer
 */

const viewerConfig = {
    /* Enable commenting APIs */
    enableAnnotationAPIs: true,
    includePDFAnnotations: true,
    downloadWithAnnotations: true,
};

document.addEventListener('adobe_dc_view_sdk.ready', function() {
    const adobeDCView = new AdobeDC.View(
        {clientId: 'df96b4d620344f5f8f9128cc01baab40', divId: 'adobe-dc-view'},
    );
    const previewFilePromise = adobeDCView.previewFile(
        {
            // Pass the filename '/pdf/english ch1.pdf'
            content: {location: {url: `/pdf/${subject} ch${id}.pdf`}},
            metaData: {
                fileName: fname,
                id: '6d07d124-ac85-43b3-a867-36930f502ac6',
            },
        },
        viewerConfig,
    );

    // Set the profile
    const profile = {
        userProfile: {
            name: name,
        },
    };
    adobeDCView.registerCallback(
        AdobeDC.View.Enum.CallbackType.GET_USER_PROFILE_API,
        function() {
            return new Promise((resolve, reject) => {
                resolve({
                    code: AdobeDC.View.Enum.ApiResponseCode.SUCCESS,
                    data: profile,
                });
            });
        },
    );

    // Find the total number of pages of PDF
    let pages;
    previewFilePromise.then((adobeViewer) => {
        adobeViewer.getAPIs().then((apis) => {
            apis.getPDFMetadata()
                .then((result) => {
                    console.log(result);
                    pages = result.numPages;
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    });

    // When an annotation is added show it in the comments section
    const eventOptions = {
        listenOn: [
            'ANNOTATION_ADDED',
        ],
    };

    previewFilePromise.then((adobeViewer) => {
        adobeViewer.getAnnotationManager().then((annotationManager) => {
            annotationManager.registerEventListener(
                function(event) {
                    const comment = event.data.bodyValue;
                    $.ajax({
                        type: 'POST',
                        url: '/comments',
                        data: {
                            'fname': fname,
                            'user': name,
                            'role': role,
                            'body': comment,
                            'pageNumber': event.data.target.selector.node.index + 1,
                        },
                        success: postCommentSuccessAPI,
                    });

                    /**
                     * @param {String} data
                     */
                    function postCommentSuccessAPI(data) {
                        createCommentAPI(data);
                    }
                },
                eventOptions,
            );
        });
    });

    // Don't send teacher's analytics report
    if (role != 'Teacher') {
        // Send data to analytics
        adobeDCView.registerCallback(

            /* Type of call back */
            AdobeDC.View.Enum.CallbackType.EVENT_LISTENER,
            /* call back function */
            function(event) {
                switch (event.type) {
                case 'DOCUMENT_OPEN':
                    console.log(event.type, event.data);
                    gtag('event', event.data.fileName, {
                        'event_category': 'DOCUMENT_OPEN',
                        'event_label': `${name}`,
                    });
                    break;

                case 'PAGE_VIEW':
                    console.log(event.type, event.data);
                    gtag('event', event.data.fileName, {
                        'event_category': 'PAGE_VIEW',
                        'event_label': `${name}`,
                    });

                    // Check if user has scrolled through all pages
                    if (event.data.pageNumber == pages) {
                        console.log('Yes!!');
                        gtag('event', event.data.fileName, {
                            'event_category': 'COMPLETED',
                            'event_label': `${name}`,
                        });
                    }
                    break;

                case 'DOCUMENT_DOWNLOAD':
                    console.log(event.type, event.data);
                    gtag('event', event.data.fileName, {
                        'event_category': 'DOCUMENT_DOWNLOAD',
                        'event_label': `filename: ${event.data.filename}
                                    user: ${name}`,
                    });
                    break;

                case 'DOCUMENT_PRINT':
                    console.log(event.type, event.data);
                    gtag('event', event.data.fileName, {
                        'event_category': 'DOCUMENT_PRINT',
                        'event_label': `filename: ${event.data.filename}
                                    user: ${name}`,
                    });
                    break;

                case 'TEXT_SEARCH':
                    gtag('event', event.data.fileName, {
                        'event_category': 'TEXT_SEARCH',
                        'event_label': `${event.data.searchedText}`,
                    });
                }
            },
            {
                enablePDFAnalytics: true,
                enableAnnotationEvents: true,
            },
        );
    }
});


/**
 * Function to insert comment in DOM in real-time
 * @param {String} data
 */
function createCommentAPI(data) {
    // Messy  HTML to insert into the DOM
    const html = `<div class="comment shadow" data-commentid="${data._id}">
                        <div class="row">
                            <div class="col-lg-2 col-md-2 col-sm-2 scale">
                                <div class="profile-img">
                                    <img src="/images/user.svg" alt="user-icon" width="50px" height="50px">
                                </div>
                            </div>
                            <div class="col-lg-9 col-sm-9">
                                <div class="user">
                                    <span class="name">${data.user}</span>
                                    <span class="time">${data.role}</span>
                                    <span class="pageNumber">On Page ${data.pageNumber}</span>
                                </div>
                                <div class="content">
                                    <p class="text">
                                        ${data.body}
                                    </p>
                                </div>
                                <div class="btn-group">
                                    <a class="btn btn-primary reply-btn">Reply</a>
                                    ${name == data.user ? '<a class="btn btn-danger delete-btn">Delete</a>': ''}
                                    ${name == data.user ? '<a class="btn btn-info edit-btn">Edit</a>': ''}
                                </div>
                                <div class="reply">
                                        <textarea class="shadow-sm" name="styled-textarea" id="styled"
                                            onfocus="this.value=''; setbg('#e5fff3');" onblur="setbg('white')"
                                            placeholder="Enter your reply here..."></textarea>
                                        <div class="btn-inline">
                                            <a class="inline-btn btn btn-primary post">POST</a>
                                            <a class="inline-btn btn btn-danger cancel">CANCEL</a>
                                        </div>
                                    </div>
                            </div>
                        </div>
                </div>`;

    $('#comment-list').prepend(html);
}

// Change location to whiteboard
$('.whiteboard').on('click', function() {
    window.location = '/whiteboard';
});


