angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $stateParams, $state) {

  // create Parse dummy user
  var user = new Parse.User();
  var user2 = new Parse.User();

  user.set("username", "martin");
  user.set("password", "password");
  user.set("rating", 3);
  user.set("balance", 100);
  user.set("bio", "I'm a full-stack web developer at Florida International University, studying computer science. I enjoy running, playing soccer, and building webapps. Feel free to contact me in case you have any questions about my Bolt tasks!");
  user.set("image", "martin.jpg");
  user.set("type", "employer");
  // create Parse dummy user
  user2.set("username", "jaime");
  user2.set("password", "password");
  user2.set("rating", 3);
  user2.set("balance", 200);
  user2.set("bio", "I'm a full-stack web developer at Florida International University, studying computer science. I enjoy running, playing soccer, and building webapps. Feel free to contact me in case you have any questions about my Bolt tasks!");
  user2.set("image", "jaime.jpg");
  user2.set("type", "employee");

  // user.set("bio", "I'm a full-stack web developer");
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
  // user2.set("bio", "I'm a full-stack web developer");
  // user2.signUp(null, {
  //   success: function(user2) {
  //     // Hooray! Let them use the app now.
  //     console.log(user2);
  //     console.log("Sign up successful")
  //   },
  //   error: function(user2, error) {
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

  
  // obj is the new task to be saved to db
  var obj = new Parse.Object('boltTask');

  // Render task list
  $scope.$on('$ionicView.beforeEnter', function () {
      console.log("before enter");
      $scope.redraw();   
  })

  $scope.$on('$ionicView.enter', function (){
      console.log("enter")
  })

  $scope.redraw = function(){
    $scope.taskList = [];
    var query = new Parse.Query('boltTask');
    query.equalTo("user", Parse.User.current().get('username'));
    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + results.length + " tasks");
        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) {
          var obj = results[i];
          $scope.taskList.push(obj);
        }
        console.log($scope.taskList);
      },
      error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
      }
    }); 
  }


  $scope.inProgressFilter = function(item){
    if(item.get('status') == 'inProgress'){
      return true;
    } 
    else {
      return false;
    }
  }

  $scope.completedFilter = function(item){
    if(item.get('status') == 'inProgress'){
      return false;
    } 
    else {
      return true;
    }
  }

  // Render modal
  $ionicModal.fromTemplateUrl('templates/addTaskModal.html', {
      focusFirstInput: true,
      scope: $scope
  }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.goToTaskDetail = function (item){
    $location.path('/tab/task-detail-view/'+item.id);
  }

  $scope.closeNewTask = function (){
    $scope.modal.hide();
  }

  $scope.addNewTask = function(){

    // create empty new task
    $scope.newTask = {
      user_id: Parse.User.current().get('username'),
      amount: '',
      employer_rating: '',
      category: '',
      image: '',
      title: '',
      status: 'inProgress',
      desc: ''
    };

    $scope.modal.show();

  }

  $scope.saveNewTask = function(){

    console.log("About to save newtask:");

    console.log($scope.newTask);

    obj.set('user', $scope.newTask.user_id);
    obj.set('amount', $scope.newTask.amount);
    obj.set('employer_rating', $scope.newTask.employer_rating);
    obj.set('category', $scope.newTask.category);
    obj.set('image',$scope.newTask.image);
    obj.set('title', $scope.newTask.title);
    obj.set('status', $scope.newTask.status);
    obj.set('desc', $scope.newTask.desc);

    obj.save().then(function(obj) {
      console.log("New task saved successfully.");
      console.log(obj);
    }, function(err) {
      console.log(err); 
    }); 
    $scope.modal.hide();
    $scope.redraw();
  }

})

.controller('tasks-detail-view-Ctrl', function($scope, $location, $state, $stateParams) {

  $scope.$on('$ionicView.beforeEnter', function () {
      var query = new Parse.Query('boltTask');
      query.equalTo("_id", $stateParams.id);
      query.find({
        success: function(results) {
          console.log("Successfully retrieved " + results.length + " tasks");
          // Do something with the returned Parse.Object values
          for (var i = 0; i < results.length; i++) {
            var obj = results[i];
            $scope.currentItem = {
                user_id: Parse.User.current().get('username'),
                amount: obj.get('amount'),
                employer_rating: obj.get('employer_rating'),
                category: obj.get('category'),
                image: obj.get('image'),
                title: obj.get('title'),
                status: obj.get('status'),
                desc: obj.get('desc')
              };
          }
        },
        error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
        }
      });          
  })
         
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

// Controller for task-onclick  
.controller('taskOnClick', function($scope, $location, $state, $stateParams) {
  $scope.showTask = $stateParams.id;
  var holdme = $scope.showTask;
  $scope.singleTask =[];
  $scope.showme;
  console.log(holdme);
  var query = new Parse.Query('boltTask');
  query.get(holdme, {
    success: function(object) {
      console.log("eyo")
      $scope.singleTask.push(object);
      $scope.showme = [{
        "desc": object.get("desc"),
        "title": object.get("title"),
        "amount": object.get("amount"),
        "employer": object.get("employer_rating"),
        "user": object.get("user")
      }]
      console.log(object.get("title"));
      console.log($scope.showme);
    },

    error: function(object, error) {
      // error is an instance of Parse.Error.
      console.log("nahman");
    }
  });





})

// Get the Tasks
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
