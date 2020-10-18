((angular) => {
   const app = angular.module("app", ["ui.router"]);

   app.config(function ($stateProvider, $urlRouterProvider) {
       $urlRouterProvider.otherwise("/categories");

       $stateProvider
           .state("categories", {
               url: "/categories",
               templateUrl: "templates/categories.html",
               controller: "CategoriesController"
           })
           .state("records", {
               url: "/categories/:categoryId",
               templateUrl: "templates/records.html",
               controller: "RecordsController"
           })
           .state("statistics", {
               url: "/statistics",
               templateUrl: "templates/statistics.html",
               controller: "StatisticsController"
           })
           .state("cities", {
               url: "/cities",
               templateUrl: "templates/cities.html",
               controller: "CitiesController"
           })
           .state("configuration", {
               url: "/configuration",
               templateUrl: "templates/configuration.html",
               controller: "ConfigurationController"
           })
   });

   app.controller("MainCtrl", function ($scope) {
       $scope.MENU_ITEMS = [
           { label: "КАТЕГОРІЇ", state: "categories" },
           { label: "СТАТИСТИКА", state: "statistics" },
           { label: "МІСТА", state: "cities" },
           { label: "НАЛАШТУВАННЯ", state: "configuration" }
       ];
   });
})(window.angular);