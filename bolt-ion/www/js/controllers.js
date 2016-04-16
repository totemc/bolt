angular.module('starter.controllers', [])

.controller('tasks-homeCtrl', function($scope, $location, $state, $ionicModal) {

  var obj = new Parse.Object('boltTask');
  
  obj.set('user_id',0);
  obj.set('amount', "50$");
  obj.set('employer-rating', "4.2");
  obj.set('category', "Pickup");
  obj.set('image',"https://upload.wikimedia.org/wikipedia/commons/4/4d/Cat_March_2010-1.jpg");
  obj.set('title', "Pick up dry cleaners");
  obj.set('status', "inProgress");
  obj.set('desc',"Pick up my suit");

  obj.save().then(function(obj) {}, function(err) { console.log(err); });  

  var query = new Parse.Query('boltTask');
  query.find({
    success: function(results) {
      console.log("Successfully retrieved " + results.length);

      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var obj = results[i];
        console.log(obj);
      }
    },
    error: function(error) {
    console.log("Error: " + error.code + " " + error.message);
    }
  });


  $scope.inProgressList = [
    {
      title: "Pick up dry cleaners",
      status: "inProgress",
      desc: "Get my suit",
      id: 0
    }
  ];

  $scope.completedList = [
    {
      title: "Pick up dry cleaners",
      status: "complete",
      desc: "",
      id: 0
    },
    {
      title: "Groceries",
      status: "complete",
      desc: "",
      id: 1
    },
    {
      title: "Deposit Check",
      status: "complete",
      desc: "",
      id: 2
    }
  ];

  // Render modal
  $ionicModal.fromTemplateUrl('templates/addTaskModal.html', {
      focusFirstInput: true,
      scope: $scope
  }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.goToTaskDetail = function (item){
    console.log(item);
    $location.path('/tab/task-detail-view/'+item.id);
  }

  $scope.addNewTask = function(){
    $scope.modal.show();
    $scope.newTask = [
      {
        title: "",
        status: "",
        desc: "",
        id: 0
      }
    ];
  }

  $scope.closeNewTask = function(){
    $scope.modal.hide();
  }

  $scope.saveNewTask = function(item){
    console.log($scope.newTask);
  }

})

.controller('tasks-detail-view-Ctrl', function($scope, $location, $state, $stateParams) {

  $scope.currentItemId = $stateParams.id;
  
})


.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('EmployeeCtrl', function($scope, $stateParams){
  var allTasks = [];
  var query = new Parse.Query('boltTask');
  query.find({
    success: function(results) {
      console.log("Successfully retrieved " + results.length);

      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var obj = results[i];
        allTasks.push(results[i]);
        console.log();

      }
      console.log(allTasks);
      $scope.taskz = allTasks;
      
    },
    error: function(error) {
    console.log("Error: " + error.code + " " + error.message);
    }
  });
  
  console.log("priting");

})



.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
