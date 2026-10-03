var app = angular.module(
    "smartParkApp",
    ["ngRoute"]
);


app.config(function ($routeProvider) {

    $routeProvider

        .when("/dashboard", {

            templateUrl: "views/dashboard.html",

            controller: "DashboardController"

        })


        .when("/parking-slots", {

            templateUrl: "views/parking-slots.html",

            controller: "ParkingController"

        })


        .when("/book-parking", {

            templateUrl: "views/book-parking.html",

            controller: "BookingController"

        })


        .when("/bookings", {

            templateUrl: "views/bookings.html",

            controller: "BookingsController"

        })


        .when("/charges", {

            templateUrl: "views/charges.html",

            controller: "ChargesController"

        })


        .when("/reports", {

            templateUrl: "views/reports.html",

            controller: "ReportsController"

        })


        .otherwise({

            redirectTo: "/dashboard"

        });

});