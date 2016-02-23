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
		var $container = $($(self).closest('.activity-element'));
		//Fabi
		if($container.hasClass('negative-added'))
			return true; //continue

		var button = $(
			`<div class="button-action-s pointer no-me-gusta" title="No me gusta">
					<div class="action-number" style="float:right;"> 
						<span class="like_count">
		 				</span>
					</div>
					<i class="icon-pulgarabajo" style="opacity:.6!important;"></i>
				</div>`);

		$(self).find('div.require-login.button-action-s.action-vote.hastipsy.pointer').before(button);
		//Mark as added - Fabi
		$container.addClass('negative-added');

		getVotes(shoutId,function(res,status){
			button.find('span.like_count').text(res?res.count:'0');
			button.on('click', function(event){
				event.preventDefault();
				var likes = parseInt(button.find('span.like_count').text());
				button.find('span.like_count').text(likes+1);
				vote(shoutId);
				button.off('click');
			});
		});
	});

	$('.shout-footer').each(function(){
		var actions = $(this).find('.s-action-list');
		var shoutId = actions? actions.attr('data-id') .trim() : '' ;
		var self = this;
		$(this).find('a.button-action-s.action-activity.hastipsy').on('click',function(e){
			if($(this).hasClass('.activity-already-loaded'))
				return;
			$(this).addClass('.activity-already-loaded');
			var list = $(self).parent().parent().find('.list.small-list.activity-log.hide');
			getVotes(shoutId,function(res,status){console.log("llamado!");
				if(res){
					res.voters.forEach(user=>{
						console.log(user.date);
						var element=$(
						`<div class="list-element NO-ME-GUSTA overflow"> 
						 <i class="icon icon-pulgarabajo" style="margin-right:10px;opacity:.6!important;"></i>
						  <img src=${user.avatarUrl} class="avatar-16 floatL" style="margin-right:8px"> 
						   a @<a class="hovercard" href=/${user.nick}>${user.nick}</a> no le gustó
						</div>`
						)
						list.prepend(element);
					})
				}
			});

		})
	})

	$('.list-main-actions').each(function(){
		var self = this;
		var shoutId = $(this).find('.shout-action-like').attr('data-id').trim();
		var $container = $($(self).closest('.shout-item'));
		//Fabi
		if($container.hasClass('negative-added'))
			return true; //continue

		var button = $(
			`<li>
				<a href="#" class="icon-pulgarabajo no-me-gusta" title="Votá negativo a este shout">
					<span class="like_count">
					</span>
				</a>
			</li>`);
		//Mark as added - Fabi
		$container.addClass('negative-added');
		$(self).append(button);

		getVotes(shoutId,function(res,status){
			button.find('span.like_count').text(res?res.count:'0');	
			button.on('click', function(event){
				event.preventDefault();
				var likes = parseInt(button.find('span.like_count').text());
				button.find('span.like_count').text(likes+1);
				vote(shoutId);
				button.off('click');
			});
		});
	})	

	$('article.shoutsb').each(function(){
		var self = this;
		var shoutId = $(this).attr('data-id') ? $(this).attr('data-id') .trim() : '' ;
		getVotes(shoutId,function(res,status){
			var button = $(
			`<a class="shoutsb__like icon-pulgarabajo">
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
	//Stylesheet
	var Stylesheet =".button-action-s.no-me-gusta .action-number{float:right;} .button-action-s.no-me-gusta .icon-pulgarabajo{float:left;margin:2px 11px;margin-right:2px;} ";
	$('head').append('<style>'+Stylesheet+'</style>');
	renderButtons();
});

//Fabi
if(window.location.pathname ==='/mi'){
	// /mi
	$('#Feed-list').onResize().on('resize',function(event){
		renderButtons();
	});
}else{
	//shouts
	$('.shouts-list').onResize().on('resize',function(event){
		renderButtons();
	});
}