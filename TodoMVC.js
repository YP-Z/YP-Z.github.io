  //返回指定元素
  var $ = function(sel) {
    return document.querySelector(sel);
  };
  // //返回全部指定元素
  // var $All = function(sel) {
  //   return document.querySelectorAll(sel);
  // };
  //集合到数组中
  var makeArray = function(likeArray) {
    var array = [];
    for (var i = 0; i < likeArray.length; ++i) {
      array.push(likeArray[i]);
    }
    return array;
  };

  var guid = 0;
  var CL_COMPLETED = 'completed';
  var CL_EDITING = 'editing';
  
  function update() {
    model.flush();
    var data = model.data;   
     
    var todoList = $('.todo-list');
    //清空todoList内所有内容
    todoList.innerHTML = '';
    //开始循环
    var activeCount = 0;
    data.items.forEach(function(itemData, index) {
      if (!itemData.completed){
        activeCount++;
      }

        var item = document.createElement('li');
        var id = 'item' + guid++;
        item.setAttribute('id', id);
        if (itemData.completed){
          item.classList.add(CL_COMPLETED);
        }
        //创建完整的todo-list，包含checkbox按钮，todo-list的内容，edit按钮，destroy按钮
        item.innerHTML = [
          '<div class="view">',
          '  <input class="toggle" type="checkbox">',
          '<label class="todo-label" width=70%>' + itemData.msg + '</label>',
          '  <button class="edit"></button>',
          '  <button class="destroy"></button>',
          '</div>'
        ].join('');
  
        var itemToggle = item.querySelector('.toggle');
        itemToggle.checked = itemData.completed;
        itemToggle.addEventListener('change', function() {
          itemData.completed = !itemData.completed;
          update();
        }, false);
  
        //点击edit按钮，编辑todo-list
        item.querySelector('.edit').addEventListener('click', function() {
            var label = item.querySelector('.todo-label'); 
            //添加editing状态        
            item.classList.add(CL_EDITING);  
            //定义finish变量    
            var finished = false;
            //定义整个编辑框
            var editor = document.createElement('li');
            editor.setAttribute('class', 'editor');
            editor.setAttribute('type', 'li');
            //写入编辑框中的内容
            editor.innerHTML = [
                //编辑框中的text文本内容
                '<input class="content" type="text" value='+label.innerHTML+'>',
                //编辑框后面的save保存按钮
                '<button class="save" type="button">SAVE</button>'
            ].join('');
            //将编辑框添加到item中，并将输入焦点转移至编辑框上
            item.appendChild(editor);
            editor.focus();
            //结束函数finish()
            function finish() {
                if (finished) return;
                finished = true;
                item.removeChild(editor);
                item.classList.remove(CL_EDITING);
            }     
            //点击保存按钮save后
            editor.querySelector('.save').addEventListener('click', function() {
                //取修改后的值
                var text = editor.querySelector('.content');
                //标签赋值
                label.innerHTML = text.value;
                //msg赋值
                itemData.msg = text.value;
                //结束
                finish();
                update();
            }, false);
        }, false);
        //点击x按钮，清除todo-list
        item.querySelector('.destroy').addEventListener('click', function() {
            var msg = "Are you sure to delete it?\n\nPlease confirm!"; 
            if (confirm(msg)==true){ 
              data.items.splice(index, 1);
              update();
              return true; 
            }else{ 
              return false; 
            }          
        }, false);
        //将todo-list插入到最前面
        todoList.insertBefore(item, todoList.firstChild);
    });
  
    var newTodo = $('.new-todo');
    newTodo.value = data.msg;
    //剩余未完成的list情况
    var count = $('.todo-count');
    if(activeCount){
      if(activeCount > 1){
        count.innerHTML = activeCount + " items left";
      }
      else{
        count.innerHTML = activeCount + " item left";
      }
    }
    else{
      count.innerHTML = "No item left";
    }

    var completedCount = data.items.length - activeCount;

  
    var clearCompleted = $('.clear-completed');
    clearCompleted.style.visibility = completedCount > 0 ? 'visible' : 'hidden';
  
    var toggleAll = $('.toggle-all');
    toggleAll.style.visibility = data.items.length > 0 ? 'visible' : 'hidden';
    toggleAll.checked = activeCount == 0;
  
  }
  
  window.onload = function() {
    model.init(function(){

        var data = model.data;
        //输入框赋值
        var newTodo = $('.new-todo');
        newTodo.addEventListener('keyup', function() {
            data.msg = newTodo.value;
        });
        newTodo.addEventListener('change', function() {
            model.flush();
        });
        //add按钮触发
        var addNewone = $('.add-newone');
        addNewone.addEventListener('click', function() {
            if (data.msg == '') {
                confirm("input msg is empty");
                return;
            }
            //添加事件
            data.items.push({msg: data.msg, completed: false});
            //搜索框内数据清空
           data.msg = '';
            //刷新
            update();
        }, false);

        //清空已完成
        var clearCompleted = $('.clear-completed');
        clearCompleted.addEventListener('click', function() {         
          for(let i = data.items.length-1; i >= 0; i--) {
            if(data.items[i].completed){
              data.items.splice(i, 1);
            }
          }
          update();
        }, false);

        //全选或全取消
        var toggleAll = $('.toggle-all');
        toggleAll.addEventListener('change', function() {
            var completed = toggleAll.checked;
            for(let i = data.items.length-1; i >= 0; i--) {
              data.items[i].completed = completed;
            }
            update();
        }, false);
    
        update();
    });
  };