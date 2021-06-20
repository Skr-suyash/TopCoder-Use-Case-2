/* eslint-disable max-len */
/**
 * JS Script for Posting, Replying and Reading Comments using JQUERY
 */

// Submit the comments checking if they are valid
$('#submit').on('click', function() {
    if (validate($('#textarea').val())) {
        $.ajax({
            type: 'POST',
            url: '/comments',
            data: {
                'fname': fname,
                'user': name,
                'role': role,
                'body': $('#textarea').val(),
            },
            success: postCommentSuccess,
        });

        /**
         * @param {String} data
         */
        function postCommentSuccess(data) {
            $('#textarea').val('');
            $('.err-red').hide();
            createComment(data);
        }
    } else {
        $('#textarea').after('<span class="err-red">Error</span>').focus();
    }
});
/**
     * Push the data to the Page in real-time
     * @param {String} data
     */
function createComment(data) {
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

// Stop refreshing when user writes comments
$('.reply-btn').on('click', function() {
    clearInterval(interval);
});

// Stop Refreshing after focus out of TextArea
$('.styled-textarea').focusout(function() {
    clearInterval(interval);
});

/**
 * Function to display the reply box
 */

$('#comment-list').delegate( '.reply-btn', 'click', function() {
    clearInterval(interval); // Stop refreshing

    // Hide the reply and edit button and show the reply textbox
    $(this).hide();
    $(this).closest('.comment').find('.reply').show();
    $(this).parents('.comment').find('.edit-btn').hide();

    // Handle cancel button (Show reply and edit button and hide textbox)
    $('.cancel').on('click', function() {
        $(this).parents('.comment').find('.reply-btn').show();
        $(this).parents('.comment').find('.edit-btn').show();
        $(this).parents('.reply').hide();
        refresh();
    });

    // Handle posting of replies
    $('.post').one('click', function(e) {
        const commentId = $(this).parents('.comment').data('commentid');
        const commentText = $(this).parents('.reply').find('textarea').val();
        const element = $(this);
        // Post the replies after validation
        if (validate(commentText)) {
            $.ajax({
                type: 'POST',
                url: '/reply',
                data: {
                    id: commentId,
                    user: name,
                    role: role,
                    reply: commentText,
                },
                success: function(data) {
                    clearInterval(interval);
                    postReplySuccess(data, element);
                },
            });
        } else {
            $(this).parents('.reply').find('textarea')
                .after('<span class="err-red">Error</span>')
                .focus();
        }

        /**
         * @param {String} data - Data received from the server
         * @param {JQuery} element
         */
        function postReplySuccess(data, element) {
            // Hide the textbox and show reply button
            element.parents('.comment').find('.reply-btn').show();
            element.parents('.comment').find('.edit-btn').show();
            element.parents('.reply').hide();
            createReply(data, element);
            refresh();
        }

        /**
         * Fuction to insert replies in real-time
         * @param {String} data
         * @param {JQuery} element
         */
        function createReply(data, element) {
            const html = `<div class="people-reply">
            <div class="reply-user">
                <span class="user-name">${data.user}</span>
                <span class="reply-role">(${data.role})</span>
            </div>
                <p class="reply-p">${data.body}</p>
            </div>`;
            element.parents('.comment').find('.replies-list').append(html);
        }
        e.stopImmediatePropagation();
        return false;
    });
});

$('#comment-list').delegate( '.delete-btn', 'click', function() {
    const commentId = $(this).parents('.comment').data('commentid');
    const element = $(this);
    $.ajax({
        type: 'DELETE',
        url: '/comments',
        data: {
            id: commentId,
        },
        success: function(data) {
            postDeleteSuccess(data, element);
        },
    });

    /**
     * Function to delete the comments from DOM
     * @param {String} data
     * @param {JQuery} element
     */
    function postDeleteSuccess(data, element) {
        element.parents('.comment').fadeOut();
    }
});

$('.edit-btn').on('click', function() {
    clearInterval(interval);
});

$('#comment-list').delegate( '.edit-btn', 'click', function() {
    clearInterval(interval);

    $('.cancel').on('click', function() {
        $(this).parents('.reply').hide();
        refresh();
    });

    $(this).closest('.comment').find('.reply').show();

    $('.post').one('click', function() {
        const commentId = $(this).parents('.comment').data('commentid');
        const commentText = $(this).parents('.comment')
            .find('.reply').children('textarea').val();
        const element = $(this);
        // Post the replies after validation
        if (validate(commentText)) {
            $.ajax({
                type: 'PUT',
                url: '/comments',
                data: {
                    id: commentId,
                    body: commentText,
                },
                success: function(data) {
                    editReplySuccess(data, element);
                },
            });
        } else {
            $(this).parents('.reply').find('textarea')
                .after('<span class="err-red">Error</span>')
                .focus();
        }

        /**
         * Function to update the DOM in case of any edits
         * @param {String} data
         * @param {JQuery} element
         */
        function editReplySuccess(data, element) {
            // Hide the textbox and show reply button
            element.parents('.comment').find('.reply-btn').show();
            element.parents('.reply').hide();
            refresh();
            element.parents('.comment').find('p.text').html(data.body);
        }
    });
});

/**
 * Validate the textarea
 * @param {String} string
 * @return {Boolean}
 */
function validate(string) {
    if (string.replace(/^\s+|\s+$/g, '') == '') {
        return false;
    } else {
        return true;
    }
}

let interval;
/**
 * Function to refresh the comments after 3 seconds
 */
function refresh() {
    interval = setInterval(() => {
        $('#comment-list').load(document.URL + ' #comment-list');
    }, 3000);
}
refresh();

// Handle refresh button clicks
$('.refresh').on('click', function() {
    $('#comment-list').load(document.URL + ' #comment-list');
});

/**
 * Function to xhenge the bgcolor of textarea on click
 * @param {String} color
*/
function setbg(color) { // eslint-disable-line no-unused-vars
    document.getElementById('styled').style.background=color;
}

