const serverURL = 'http://glacial-cove-76906.herokuapp.com';


function getVotes(shoutId,cb){
	$.get(serverURL+'/get-votes?shout_id='+shoutId,function(res,status){
		return cb(res,status);
	});
}

function renderButtons(){

	$('.shout-footer > .s-action-list').each(function(){
		var self = this;
		var shoutId = $(this).attr('data-id') ? $(this).attr('data-id') .trim() : '' ;
		getVotes(shoutId,function(res,status){
			var button = $(
			`<div class="button-action-s pointer" original-title="No me gusta">
					<i class="icon thumb-down"></i>
					<div class="action-number">
						<span class="like_count">
							${res?res.count:'0'}
						</span>
					</div>
				</div>`);
			$(self).find('.action-vote').after(button);
			button.on('click', function(event){
				event.preventDefault();
				var likes = parseInt(button.find('span.like_count').text());
				button.find('span.like_count').text(likes+1);
				vote(shoutId);
				button.off('click');
			});
		});
	});

	$('article.shoutsb').each(function(){
		var self = this;
		var shoutId = $(this).attr('data-id') ? $(this).attr('data-id') .trim() : '' ;
		getVotes(shoutId,function(res,status){
			var button = $(
			`<a class=" like shoutsb__like icon-pulgarabajo">
				<span class="like_count">
					${res?res.count:'0'}
				</span>
			</a>`);
			$(self).find('.like.shoutsb__like.icon-pulgararriba').after(button);
			button.on('click', function(event){
				event.preventDefault();
				var likes = parseInt(button.find('span.like_count').text());
				button.find('span.like_count').text(likes+1);
				vote(shoutId);
				button.off('click');
			});
		});
	});


	$('.list-main-actions').each(function(){
		var self = this;
		var shoutId = $(this).find('.shout-action-like').attr('data-id').trim();
		getVotes(shoutId,function(res,status){
			var button = $(
			`<li>
				<a href="#" class="icon-pulgarabajo no-me-gusta" title="Votá negativo a este shout">
					<span class="like_count">
					${res?res.count:'0'}
					</span>
				</a>
			</li>`);
			$(self).append(button);
			button.on('click', function(event){
				event.preventDefault();
				var likes = parseInt(button.find('span.like_count').text());
				button.find('span.like_count').text(likes+1);
				vote(shoutId);
				button.off('click');
			});
		});
	})	
}

function vote(shoutId){

	var avatarUrl = '';
	var user_id = '';
	var nick = $('.user-name').text().trim();

	$.get('http://api.taringa.net/user/nick/view/'+nick,function(res,status){
		user_id = res.id;
		avatarUrl=res.avatar? res.avatar.medium:'';
		$.post(serverURL+'/vote',{
			shout_id:shoutId,
			avatarUrl:avatarUrl,
			nick:nick,
			user_id:user_id
		},function(res,status){
			console.log(res,status);
		});		
	})
}

$(document).ready(function(){
	renderButtons();
});

$(document).ajaxSuccess(function(event, jqXHR, settings) {
    if (settings && settings.url.indexOf('ajax/feed/fetch') > -1 || settings.url.indexOf('serv/more/trend') > -1) {
        renderButtons();
    }
});