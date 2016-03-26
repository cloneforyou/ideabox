$(document).ready(function(){
  refreshTags()
  Idea.addAll()
  $('#save-idea').on('click', Idea.create)
  $('#idea-box').delegate('button.deleter',   'click', Idea.destroy)
  $('#idea-box').delegate('button.voter', 'click', Idea.vote)
  $('#sort-by-quality').on('click', Sorter.byQuality)
  $('#fuzzy-filter').on('keyup', Filter.search)
  $('#show-all').on('click', Filter.clear)
  $('#tag-list').delegate('button', 'click', Filter.byTag)

  $('#idea-box').delegate('span.title', 'focusout', updateTitle)
  $('#idea-box').delegate('span.body', 'click', editBody)
  $('#idea-box').delegate('#idea-body-editor', 'focusout', updateBody)
})

function editBody(e){
  var body = $(e.target).closest('.idea').data('full-body')
   var xx = $(e.target).replaceWith('<textarea class="form-control" id="idea-body-editor">' + body + '</textarea>')
   $('#idea-body-editor').height($('#idea-body-editor').prop('scrollHeight'));
   $('#idea-body-editor').focus()
}

function updateBody(e){
  var body = $('#idea-body-editor').val()
  var id = $(e.target).closest('.idea').data('id')
  var tags = $(e.target).closest('.idea').data('tags').split(" ").filter(function(w){return w})
  var idea = {body: body, tags: tags}
  // debugger
  $.ajax({
    type: 'PATCH',
    url: '/api/v1/ideas/' + id,
    data: {idea: idea}
  }).success( Idea.reload(id))

}

function updateTitle(e){
var title = e.target.textContent
// var id = e.target.parentElement.parentElement.parentElement.parentElement.dataset.id
var id = $(e.target).closest('.idea').data('id')
var tags = $(e.target).closest('.idea').data('tags').split(" ").filter(function(w){return w})
var idea = {title: title, tags: tags}

$.ajax({
  type: 'PATCH',
  url: '/api/v1/ideas/' + id,
  data: {idea: idea}
}).success(refreshIdeas)
// debugger
}

// function editTitle(e){
//   // debugger
//   // e.stopPropagation()
//   e.target.contentEditable = true
//   e.target.focus()
// }

// function cleanFilters(){
//   $.each($('.idea'), function(){ $(this).show() })
//   $('#fuzzy-filter').val("")
//   $('#tag-list button').removeClass('active')
// }

// }

// function filterTag(e){
//   // debugger
//   var that = e.target
//   // console.log(this);
//   var filter = $(that).html()
// $(that).addClass('active')
//   $.each($('.idea'), function(){
//     var title = $(this).find('.title').text()
//     var body  = $(this).find('.body') .text()
//     var text  = title + ': ' + body
//     // debugger
//
//     if (!this.dataset.tags.includes(filter)) {
//       $(this).hide()
//     }
//   })
//
// }

// function sortByQuality(){
//   var currentOrder = this.dataset.order
//
//   var sortedIdeas = $('.idea').sort(function(a,b){
//     var value = ['swill', 'plausible', 'genius']
//     var av = value.indexOf($(a).find('.label').text())
//     var bv = value.indexOf($(b).find('.label').text())
//
//     if (currentOrder === 'asc') {
//       return bv - av
//     } else { return av - bv }
//   })
//
//   if (currentOrder === 'asc') {
//     this.dataset.order = 'desc'
//   } else { this.dataset.order = 'asc' }
//
//   $('#idea-box').empty().append(sortedIdeas)
// }

// function fuzzyFilter(){
//   var filter = $('#fuzzy-filter').val()
//
//   $.each($('.idea'), function(){
//     debugger
//     var title = $(this).find('.title').text()
//     var body  = $(this).find('.body') .text()
//     var text  = title + ': ' + body
//     if (text.includes(filter)) {
//       $(this).show()
//     } else {
//       $(this).hide()
//     }
//   })
// }

function updateIdea(){
  var title = $(this.parentElement).find('.title').text()
  var body  = $(this.parentElement).find('.body').text()
  var id = this.parentElement.dataset.id
  var tags = this.parentElement.dataset.tags.split(" ").filter(function(w){return w})
  var idea = {title: title, body: body, tags: tags}

  $.ajax({
    type: 'PATCH',
    url: '/api/v1/ideas/' + id,
    data: {idea: idea}
  }).success(refreshIdeas)
}

function editIdea(){
  $(this.parentElement).find('.title').prop('contenteditable', 'true').toggleClass('editableField')
  $(this.parentElement).find('.body').prop('contenteditable', 'true').toggleClass('editableField')
  $(this.parentElement).find('.ui').toggle()
}

// function deleteIdea(){
//   var id = this.parentElement.dataset.id || this.parentElement.parentElement.parentElement.dataset.id
//   $.ajax({
//     type: 'DELETE',
//     url: '/api/v1/ideas/' + id
//   }).success(refreshIdeas)
// }

// function saveIdea(e){
//   e.preventDefault()
//   var idea = {title: title(), body: body(), tags: tags()}
//   $.ajax({
//     type: 'POST',
//     url: '/api/v1/ideas',
//     data: {idea: idea}
//   }).success(Idea.addLast)
//   // }).success(refreshIdeas)
//   clearForm()
// }

// function tags(){
//   return $('#idea-tags').val().split(",")
//                         .map(function(w){return w.trim()})
//                         .filter(function(w){return w})
// }

// function clearForm(){
//   $('#idea-title').val("")
//   $('#idea-body').val("")
//   $('#idea-tags').val("")
// }

// function title(){ return $('#idea-title').val() }
//
// function body(){ return $('#idea-body').val() }

function refreshIdeas(){
  $('#idea-box').empty()
  refreshTags()
  // $.ajax({
  //   action: 'GET',
  //   url: '/api/v1/ideas'
  // }).success(appendAllToIdeasBox)
  Idea.addAll()
}

function refreshTags(){
  $('#tag-list').empty()

  $.ajax({
    action: 'GET',
    url: '/api/v1/tags'
  }).success(function (tags){
    var buttons = tags.map(function(tag){
      return '<button id="'+
      tag.name+
      '" type="button" class="btn btn-primary-outline ui" name="button">'+
      tag.name+
      '</button>'
    })

    $('#tag-list').append(buttons)
  })
}

function appendAllToIdeasBox(ideas) { appendAllTo(ideas, $('#idea-box')) }

function appendAllTo(items, $target){
  $.each(items, function(index, item){
    // $target.append( html_for(item) )
    var target = document.getElementById('idea-box')
    target.appendChild(HtmlFor.idea(item))
    // $target.appendChild(HtmlFor.idea(item))
  })
}

function html_for(idea) {
  return '<li data-id="' + idea.id +
  '" data-tags="'+ idea.tags.join(" ") +
  '" class="idea list-group-item">' +
  '<span class="title">'+ idea.title + '</span>: ' +
  '<span class="body">'+ limit_length(idea.body) + '</span>' +
  '<button type="button" name="button" class="deleter   ui btn btn-danger btn-sm pull-xs-right">Delete</button>' +
  '<button type="button" name="button" class="editor    ui btn btn-info btn-sm pull-xs-right">Edit</button>' +
  '<button type="button" name="button" class="voter ui btn btn-warning btn-sm pull-xs-right">Downvote</button>' +
  '<button type="button" name="button" class="voter   ui btn btn-success btn-sm pull-xs-right">Upvote</button>' +
  '<button type="button" name="button" class="updater   ui btn btn-primary btn-sm pull-xs-right" style="display:none">Update</button>' +
  '<span class="ui label label-' +
  color_for(idea.quality) +
  ' label-pill pull-xs-right">' +
  idea.quality +
  '</span></li>'
}

function color_for(quality){
  if (quality === 'genius')    { return 'success' }
  if (quality === 'plausible') { return 'warning' }
  if (quality === 'swill')     { return 'default' }
}

function limit_length(text){
  if (text.length <= 100) {
    return text
  } else {
    var short = text.substring(0,96)
    return short.substring(0,text.lastIndexOf(" ")) + ' ...'
  }
}
