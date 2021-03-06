angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $stateParams, $state) {

  // create Parse dummy user
  // var user = new Parse.User();
  // var user3 = new Parse.User();

  // user.set("username", "martin");
  // user.set("password", "password");
  // user.set("rating", 3);
  // user.set("balance", 100);
  // user.set("bio", "I'm a full-stack web developer at Florida International University, studying computer science. I enjoy running, playing soccer, and building webapps. Feel free to contact me in case you have any questions about my Bolt tasks!");
  // user.set("image", "martin.jpg");
  // user.set("type", "employer");
  // // create Parse dummy user
  // user2.set("username", "jaime");
  // user2.set("password", "password");
  // user2.set("rating", 3);
  // user2.set("balance", 200);
  // user2.set("bio", "I'm a full-stack web developer at Florida International University, studying computer science. I enjoy running, playing soccer, and building webapps. Feel free to contact me in case you have any questions about my Bolt tasks!");
  // user2.set("image", "jaime.jpg");
  // user2.set("type", "employee");

  // user3.set("username", "adrian");
  // user3.set("password", "password");
  // user3.set("rating", 3);
  // user3.set("balance", 100);
  // user3.set("bio", "I'm a full-stack web developer at Florida International University, studying computer science. I enjoy running, playing soccer, and building webapps. Feel free to contact me in case you have any questions about my Bolt tasks!");
  // user3.set("image", "adrian.jpg");
  // user3.set("type", "employer");

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
  // user3.set("bio", "I'm a full-stack web developer");
  // user3.signUp(null, {
  //   success: function(user3) {
  //     // Hooray! Let them use the app now.
  //     console.log(user3);
  //     console.log("Sign up successful")
  //   },
  //   error: function(user3, error) {
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
        if(user.get('type') == 'employee'){
            $state.go('tab.my-jobs');
        } else {
            $state.go('tab.dash')
        }
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

  $scope.query = {
    text: ''
  }; 

  $scope.searchFilter = function(item){
      if(item.get('title').toLowerCase().indexOf($scope.query.text.toLowerCase()) > -1){
        return true;
      }
      else{
        return false;
      }
  }

  // Render task list
  $scope.$on('$ionicView.beforeEnter', function () {
      console.log("before enter");
      $scope.redraw();   
  })

  // $scope.$on('$ionicView.enter', function (){
  //     console.log("enter");
  //     $scope.redraw();
  // })

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
        $scope.$apply();
      },
      error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
      }
    }); 
  }

  $scope.submittedFilter = function(item){
    if(item.get('status') == 'submitted'){
      return true;
    } 
    else {
      return false;
    }
  }

  $scope.inProgressFilter = function(item){
    if(item.get('status') == 'inProgress'){
      console.log("inprogress");
      return true;
    } 
    else {
      return false;
    }
  }

  $scope.completedFilter = function(item){
    if(item.get('status') == 'completed'){
      return true;
    } 
    else {
      return false;
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
      status: 'submitted',
      desc: '',
      zip: '',
      location: '',
      bargain_amount: '0',
      accepted_by: ''
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
    obj.set('zip', $scope.newTask.zip);
    obj.set('location', $scope.newTask.location);
    obj.set('bargain_amount', $scope.newTask.bargain_amount);
    obj.set('accepted_by', $scope.newTask.accepted_by);

    obj.save().then(function(obj) {
      console.log("New task saved successfully.");
      console.log(obj);
      $scope.redraw();
      $scope.modal.hide();
    }, function(err) {
      console.log(err); 
    }); 
  }

})

.controller('tasks-detail-view-Ctrl', function($scope, $location, $state, $stateParams) {

  $scope.currentUser = Parse.User.current();

  $scope.$on('$ionicView.beforeEnter', function () {
      var query = new Parse.Query('boltTask');
      query.equalTo("_id", $stateParams.id);
      query.find({
        success: function(results) {
          console.log("Successfully retrieved " + results.length + " tasks");
          // Do something with the returned Parse.Object values
          for (var i = 0; i < results.length; i++) {
            var obj = results[i];
            $scope.item = {
                user_id: Parse.User.current().get('username'),
                amount: obj.get('amount'),
                employer_rating: obj.get('employer_rating'),
                category: obj.get('category'),
                image: obj.get('image'),
                title: obj.get('title'),
                status: obj.get('status'),
                desc: obj.get('desc'),
                accepted_by: obj.get('accepted_by')
              };
          }
        },
        error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
        }
      });          
  })

  $scope.loadBoltProfile = function(username){
    $location.path('/tab/account-nonself/'+username);
  }
         
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
.controller('taskOnClick', function($scope, $location, $state, $stateParams, $ionicHistory) {
  $scope.showTask = $stateParams.id;
  var holdme = $scope.showTask;
  $scope.singleTask =[];
  $scope.showme;
  $scope.saveme;
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
        "user": object.get("user"),
        "image": object.get("image"),
        "bargain_amount": object.get("bargain_amount"),
        "accepted_by": object.get("accepted_by"),
        "status": object.get("status")
      }]
      $scope.saveme = $scope.showme;
      console.log(object.get("title"));
      console.log($scope.showme);
    },

    error: function(object, error) {
      // error is an instance of Parse.Error.
      console.log("nahman");
    }
  });
  $scope.add = function(){
    console.log("here it is");
    console.log($scope.showme);

    $scope.showme[0].amount = parseInt($scope.showme[0].amount)+1;
  }
  $scope.subtract = function(){
    $scope.showme[0].amount = parseInt($scope.showme[0].amount)-1;
  }
  $scope.accept = function(){
    var Task = Parse.Object.extend("boltTask");
    var query = new Parse.Query(Task);
    query.get(holdme, {
      success: function(task) {
        console.log("reat");
        var bargain = $scope.showme[0].amount;
        bargain = bargain+'';
      
        if($scope.showme[0].bargain_amount == "0"){
          task.set("status", "inProgress");
          console.log(task.get('status'));
        }
        task.set("accepted_by", Parse.User.current().get('username'));
        task.set("bargain_amount", ass);
        task.save(null, {
          success: function(data) {
              console.log(data);
              $state.go('tab.my-jobs');
              console.log("giongabck");
          }
        });
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
      }
    });

  }

})

// Get the Tasks
.controller('EmployeeCtrl', function($scope, $stateParams, $location, $state, $ionicModal){
  $scope.$on('$ionicView.beforeEnter', function () {
      console.log("before enter");
      $scope.employeeRefresh();   
  })

  

  // Render modal
  $ionicModal.fromTemplateUrl('templates/filterModal.html', {
      focusFirstInput: true,
      scope: $scope
  }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.openFilter = function(){
      $scope.modal.show();
  }

  $scope.close = function (){
    $scope.modal.hide();
    console.log($scope.filter);
    $scope.redraw();
  }

  $scope.$on('$ionicView.beforeEnter', function () {
      $scope.redraw();   
  })

  $scope.filterCategory = function(task){

      if($scope.filter.category == 'All'){
        return true;
      }
      else if(task.attributes.category == $scope.filter.category){
        return true;
      } else {
        return false;
      }      
  }


  // var current_location = new Parse.GeoPoint({
  //   latitude: 25.777680,
  //   longitude: -80.190128
  // });

  // var query = new Parse.Query('boltTask');

  // $scope.filter = {distance: 20, category: 'All'};

  // query.withinMiles('point', current_location, $scope.filter.distance);

  $scope.employeeRefresh = function(){
  var allTasks = [];
  var query = new Parse.Query('boltTask');
  query.find({
    success: function(results) {
      console.log("Successfully retrieved " + results.length);
      // Do something with the returned Parse.Object values
      for (var i = 0; i < results.length; i++) {
        var obj = results[i];
        if(results[i].attributes.status == "submitted"){
        allTasks.push(results[i]);
        }
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
}
})
.controller('profile-nonselfCtrl', function($scope, $stateParams, $state, $ionicModal){
  console.log($state);
  console.log("s");
  // var query = new Parse.Query(Parse.User);
  // query.equalTo('username', $stateParams.username);
  // query.first({
  //   success: function(res){
  //     console.log(res);
  //     $scope.userProfile = res;
  //     $scope.$apply();
  //   }
  // });

  // $scope.message = {
  //   from: Parse.User.current().get('username'),
  //   text: '',
  //   subject: ''
  // }

  // $scope.logout = function(){
  //   Parse.User.logOut().then(
  //    function() {
  //        $state.go('login');     
  //      }, function(error) {
  //      }
  //   );
  // }

  // // Render modal
  // $ionicModal.fromTemplateUrl('templates/messageModal.html', {
  //     focusFirstInput: true,
  //     scope: $scope
  // }).then(function(modal) {
  //     $scope.modal = modal;
  // });

  // $scope.openMessageModal = function(){
  //     $scope.modal.show();
  // }

  // $scope.close = function (){
  //   $scope.modal.hide();
  // }

  // $scope.send = function (){
  //   console.log($scope.message);
  //   $scope.modal.hide();
  // }


  
  console.log("priting");
})

.controller('profileCtrl', function($scope, $stateParams, $state, $ionicModal){

  console.log("user");
  $scope.currentUser = Parse.User.current();

  $scope.$on('$ionicView.beforeEnter', function () {
      console.log("before enter");
      $scope.currentUser.fetch();
      console.log("before enter");
  })

  
  $scope.message = {
    from: $scope.currentUser.get('username'),
    text: '',
    subject: ''
  }

  $scope.logout = function(){
    Parse.User.logOut().then(
     function() {
         $state.go('login');     
       }, function(error) {
       }
    );
  }

  // Render modal
  $ionicModal.fromTemplateUrl('templates/messageModal.html', {
      focusFirstInput: true,
      scope: $scope
  }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.openMessageModal = function(){
      $scope.modal.show();
  }

  $scope.close = function (){
    $scope.modal.hide();
  }

  $scope.send = function (){
    console.log($scope.message);
    $scope.modal.hide();
  }

})


.controller('jobsCtrl', function($scope, $location, $ionicModal) {
  console.log("i am ");
  console.log(Parse.User.current().get('username'));
  $scope.progressTasks = [];
  $scope.completedTasks = [];
  $scope.$on('$ionicView.beforeEnter', function () {
      console.log("before enter");
      $scope.allTasks = [];
      var query = new Parse.Query('boltTask');
      query.find({
        success: function(results) {
          console.log("Successfully retrieved " + results.length);
          // Do something with the returned Parse.Object values
          for (var i = 0; i < results.length; i++) {
            var obj = results[i];
            if(results[i].attributes.status == "submitted"){
            $scope.allTasks.push(results[i]);
            }
            console.log();
          }
          console.log($scope.allTasks);
          $scope.taskz = $scope.allTasks;
          
        },
        error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
        }
      });
      $scope.redraw();   
  })

  
  //Render modal
  $ionicModal.fromTemplateUrl('templates/filterModal.html', {
      focusFirstInput: true,
      scope: $scope
  }).then(function(modal) {
      $scope.modal = modal;
  });

  $scope.openFilter = function(){
      $scope.modal.show();
  }

  $scope.close = function (){
    $scope.modal.hide();
    console.log($scope.filter);
    
  }

  $scope.filterCategory = function(task){

      if($scope.filter.category == 'All'){
        return true;
      }
      else if(task.attributes.category == $scope.filter.category){
        return true;
      } else {
        return false;
      }      
  }


  var current_location = new Parse.GeoPoint({
    latitude: 25.777680,
    longitude: -80.190128
  });

  var query = new Parse.Query('boltTask');

  $scope.filter = {distance: 20000, category: 'All'};

  query.withinMiles('point', current_location, $scope.filter.distance);



  $scope.shown0 = true;
  $scope.shown1 = true;
  $scope.shown2 = true;
  $scope.toggleShow = function(id){
    
    if(id == 1){
      $scope.shown1 = !$scope.shown1;   
    } 

    else if (id == 2){
      $scope.shown2 = !$scope.shown2;
    }
    else if (id == 0){
      $scope.shown0 = !$scope.shown0;
      console.log($scope.allTasks);
    }
   
  }
  $scope.goToTaskDetail = function(section,id){
    if(section == 'open'){
      $location.path('/tab/task/'+id);
    }
    else {
      console.log(id);
      $location.path('/tab/my-jobs/'+id);
    }
  }
  $scope.redraw = function(){
    $scope.progressTasks = [];
    $scope.completedTasks = [];
    var query = new Parse.Query('boltTask');
    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + results.length);
        console.log(results);
        // Do something with the returned Parse.Object values
        for (var i = 0; i < results.length; i++) {
          if(results[i].attributes.status == "completed" && results[i].attributes.accepted_by == Parse.User.current().get('username')){
            $scope.completedTasks.push(results[i]);
          }
          if(results[i].attributes.accepted_by == Parse.User.current().get('username') && results[i].attributes.status == "inProgress"){
            console.log("jaimebro");
            $scope.progressTasks.push(results[i]);

          }
        }
        console.log("here are the tasks in progression");
        console.log($scope.progressTasks);
        $scope.$apply();
        
        
      },
      error: function(error) {
      console.log("Error: " + error.code + " " + error.message);
      }
    });
  }
  console.log("priting");

  //from eployee
    // $scope.$on('$ionicView.beforeEnter', function () {
    //     console.log("before enter");
    //     $scope.employeeRefresh();   
    // })

    

    // Render modal
    // $ionicModal.fromTemplateUrl('templates/filterModal.html', {
    //     focusFirstInput: true,
    //     scope: $scope
    // }).then(function(modal) {
    //     $scope.modal = modal;
    // });

    // $scope.openFilter = function(){
    //     $scope.modal.show();
    // }

    // $scope.close = function (){
    //   $scope.modal.hide();
    //   console.log($scope.filter);
    //   $scope.employeeRefresh();
    // }

    // $scope.$on('$ionicView.beforeEnter', function () {
    //     $scope.redraw();   
    // })

    // $scope.filterCategory = function(task){

    //     if($scope.filter.category == 'All'){
    //       return true;
    //     }
    //     else if(task.attributes.category == $scope.filter.category){
    //       return true;
    //     } else {
    //       return false;
    //     }      
    // }


    // var current_location = new Parse.GeoPoint({
    //   latitude: 25.777680,
    //   longitude: -80.190128
    // });

    // var query = new Parse.Query('boltTask');

    // $scope.filter = {distance: 20, category: 'All'};

    // query.withinMiles('point', current_location, $scope.filter.distance);

})

.controller('jobCardCtrl', function($scope, $stateParams, $state, $ionicHistory, $ionicModal) {

  console.log($stateParams);
  $scope.cardTask = $stateParams.id;
  console.log($scope.cardTask);
  var local_card = $scope.cardTask;
  $scope.singleCardTask =[];
  $scope.saveHelper;
  $scope.singleTask = {};
  
  var query = new Parse.Query('boltTask');
  query.get($stateParams.id, {
    success: function(object) {
      $scope.singleTask = object;
      console.log($scope.singleTask);
      $scope.singleCardTask.push(object);
      if(object.get("status") == "completed"){
        $scope.trueOrNot = true;
      }
      else{
        $scope.trueOrNot = false;
      }
      $scope.muestra = [{
        "desc": object.get("desc"),
        "title": object.get("title"),
        "amount": object.get("amount"),
        "employer": object.get("employer_rating"),
        "user": object.get("user"),
        "image": object.get("image"),
        "bargain_amount": object.get("bargain_amount"),
        "accepted_by": object.get("accepted_by"),
        "status": object.get("status")
      }]

      $scope.saveHelper = $scope.muestra;
      console.log($scope.singleCardTask);
      
    },

    error: function(object, error) {
      // error is an instance of Parse.Error.
      console.log("nahman");
    }
  });
  // Adrian Functions
    $ionicModal.fromTemplateUrl('templates/taskCompleteModal.html', {
      focusFirstInput: true,
      scope: $scope
    }).then(function(modal) {
      $scope.modal2 = modal;
    })

    $ionicModal.fromTemplateUrl('templates/areYouSure.html', {
      focusFirstInput: true,
      scope: $scope
    }).then(function(modal) {
      $scope.modalInit = modal;
    })
    $scope.openCompleteModal = function(){
         $scope.modalInit.show();
     }
     $scope.completeTask = function(){
        $scope.modal2.show();
        $scope.modalInit.hide();
        console.log($scope.singleTask.get('user') + ' pays ' + $scope.singleTask.get('amount') + ' to ' + Parse.User.current().get('username'));
        var TransactionObject = Parse.Object.extend("transaction");
         var transactionObject = new TransactionObject();
           transactionObject.save({from: $scope.singleTask.get('user'), "to": Parse.User.current().get('username'), "amount": parseInt($scope.singleTask.get('amount')), "status": "In Progress"}, {
           success: function(object) {
             
           },
           error: function(model, error) {
             console.log(error);
           }
         });
      }

     $scope.noThanks = function(){
        $scope.modal2.hide();
      }

     $scope.close2 = function(){
        $scope.modal2.hide();
      }

     $scope.initViewClose = function(){
        $scope.modalInit.hide();
      }
        $scope.clearIt = function (){
          for (var i = 1; i <= 5 ; i++){
            var star = 'star' + i;
            var lol = angular.element(document.getElementById(star));
            lol.removeClass('ion-ios-star-outline');
          }
        }
        $scope.star1 = function (){
          var lol = angular.element(document.getElementById('star1'));
          lol.addClass('ion-ios-star');
          for (var i = 2; i <= 5; i++){
            var star = 'star' + i;
            var lol = angular.element(document.getElementById(star));
            lol.addClass('ion-ios-star-outline');
          }
        }
        $scope.star2 = function (){
          for (var i = 1; i <=2; i++){
            var star = 'star' + i;
            var lol = angular.element(document.getElementById(star));
            lol.addClass('ion-ios-star');
          }
          for (var i = 3; i <= 5; i++){
            var star = 'star' + i;
            var lol = angular.element(document.getElementById(star));
            lol.addClass('ion-ios-star-outline');
          }
        }
        $scope.star3 = function (){
          for (var i = 1; i <=3; i++){
            var star = 'star' + i;
            var lol = angular.element(document.getElementById(star));
            lol.addClass('ion-ios-star');
          }
          for (var i = 4; i <= 5; i++){
            var star = 'star' + i;
            var lol = angular.element(document.getElementById(star));
            lol.addClass('ion-ios-star-outline');
          }
        }
        $scope.star4 = function (){
          for (var i = 1; i <=4; i++){
            var star = 'star' + i;
            var lol = angular.element(document.getElementById(star));
            lol.addClass('ion-ios-star');
          }
          for (var i = 5; i <= 5; i++){
            var star = 'star' + i;
            var lol = angular.element(document.getElementById(star));
            lol.addClass('ion-ios-star-outline');
          }
        }
        $scope.star5 = function (){
          for (var i = 1; i <=5; i++){
            var star = 'star' + i;
            var lol = angular.element(document.getElementById(star));
            lol.addClass('ion-ios-star');
          }
        }
        // End of Adrian Functions
        $scope.$on('$destroy', function() {
          console.log('Removing and recreating the modal!');
          $scope.modal2.remove();
          if (!$scope.modal2){
            console.log("youre good to create one!");
            $ionicModal.fromTemplateUrl('templates/taskCompleteModal.html', {
              focusFirstInput: true,
              scope: $scope
            }).then(function(modal) {
              $scope.modal2 = modal;
            })
          }
        });

  $scope.finish = function(){
    var Task = Parse.Object.extend("boltTask");
    var query = new Parse.Query(Task);
    query.get(local_card, {
      success: function(task) {
        console.log("BREEEE");
        
        task.set("status", "completed");
        
        task.save(null, {
          success: function(data) {
              console.log(data);
              console.log("Saved Successfully");
              $state.go('tab.my-jobs');
              
          }
        });
      },
      error: function(object, error) {
        // The object was not retrieved successfully.
        // error is a Parse.Error with an error code and message.
      }
    });
  }
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
