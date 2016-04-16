angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $stateParams, $state) {

  // create Parse dummy user
  var user = new Parse.User();
  user.set("username", "martin");
  user.set("password", "password");
  user.set("rating", 3);
  user.set("bio", "I'm a full-stack web developer at Florida International University, studying computer science. I enjoy running, playing soccer, and building webapps. Feel free to contact me in case you have any questions about my Bolt tasks!");

  // user.signUp(null, {
  //   success: function(user) {
  //     // Hooray! Let them use the app now.
  //     console.log(user);
  //     console.log("Sign up successful")
  //   },
  //   error: function(user, error) {
  //     // Show the error message somewhere and let the user try again.
  //     console.log("Error: " + error.code + " " + error.message);
  //   }
  // });

  $scope.loginData = {
    username: "",
    password: ""
  };

  $scope.loadView = function(){
    Parse.User.logIn($scope.loginData.username, $scope.loginData.password, {
      success: function(user) {
        // Do stuff after successful login.
        console.log(user);
        console.log("success");
        $state.go('tab.dash');
      },
      error: function(user, error) {
        // The login failed. Check error to see why.
        console.log(error);
      }
    });
  }

})

.controller('tasks-homeCtrl', function($scope, $location, $state, $ionicModal) {

  var obj = new Parse.Object('boltTask');
  
  obj.set('user_id',0);
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

})

.controller('profileCtrl', function($scope, $stateParams){

  $scope.currentUser = Parse.User.current();
  
  if ($scope.currentUser) {
      console.log('current user');
  } else {
      console.log("Not current user");
  }

})



.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
