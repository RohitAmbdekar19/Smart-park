// =====================================================
// MAIN CONTROLLER
// =====================================================

app.controller(
    "MainController",
    function (
        $scope,
        $location
    ) {


        function updateCurrentPage() {

            var path =
                $location.path();


            if (
                path === "/dashboard"
            ) {

                $scope.currentPage =
                    "dashboard";

            }

            else if (
                path === "/parking-slots"
            ) {

                $scope.currentPage =
                    "parking-slots";

            }

            else if (
                path === "/book-parking"
            ) {

                $scope.currentPage =
                    "book-parking";

            }

            else if (
                path === "/bookings"
            ) {

                $scope.currentPage =
                    "bookings";

            }

            else if (
                path === "/charges"
            ) {

                $scope.currentPage =
                    "charges";

            }

            else if (
                path === "/reports"
            ) {

                $scope.currentPage =
                    "reports";

            }

            else {

                $scope.currentPage =
                    "dashboard";

            }

        }


        updateCurrentPage();


        $scope.$on(
            "$routeChangeSuccess",
            function () {

                updateCurrentPage();

            }
        );

    }
);



// =====================================================
// DASHBOARD CONTROLLER
// =====================================================

app.controller(
    "DashboardController",
    function (
        $scope,
        ParkingService
    ) {


        function loadData() {

            $scope.slots =
                ParkingService.getSlots();


            $scope.bookings =
                ParkingService.getBookings();

        }


        loadData();


        // -----------------------------------------
        // SLOT COUNTS
        // -----------------------------------------

        $scope.getTotalSlots = function () {

            return $scope.slots.length;

        };


        $scope.getAvailableSlots = function () {

            return $scope.slots.filter(
                function (slot) {

                    return (
                        slot.status ===
                        "available"
                    );

                }
            ).length;

        };


        $scope.getReservedSlots = function () {

            return $scope.slots.filter(
                function (slot) {

                    return (
                        slot.status ===
                        "reserved"
                    );

                }
            ).length;

        };


        $scope.getOccupiedSlots = function () {

            return $scope.slots.filter(
                function (slot) {

                    return (
                        slot.status ===
                        "occupied"
                    );

                }
            ).length;

        };


        // -----------------------------------------
        // BOOKING COUNTS
        // -----------------------------------------

        $scope.getTotalBookings = function () {

            return $scope.bookings.length;

        };


        $scope.getActiveBookings = function () {

            return $scope.bookings.filter(
                function (booking) {

                    return (
                        booking.status ===
                        "Reserved" ||

                        booking.status ===
                        "Occupied"
                    );

                }
            ).length;

        };


        $scope.getCompletedBookings = function () {

            return $scope.bookings.filter(
                function (booking) {

                    return (
                        booking.status ===
                        "Completed"
                    );

                }
            ).length;

        };


        // -----------------------------------------
        // REVENUE
        // -----------------------------------------

        $scope.getTotalRevenue = function () {

            var total = 0;


            $scope.bookings.forEach(
                function (booking) {

                    if (
                        booking.status ===
                        "Completed"
                    ) {

                        total += Number(
                            booking.finalFee ||
                            0
                        );

                    }

                }
            );


            return total;

        };


        // -----------------------------------------
        // RECENT BOOKINGS
        // -----------------------------------------

        $scope.getRecentBookings =
            function () {

                return $scope.bookings
                    .slice()
                    .sort(
                        function (a, b) {

                            return b.id - a.id;

                        }
                    )
                    .slice(0, 5);

            };


        $scope.getStatusClass =
            function (status) {

                if (
                    status === "Reserved"
                )
                    return "status-reserved";


                if (
                    status === "Occupied"
                )
                    return "status-occupied";


                if (
                    status === "Completed"
                )
                    return "status-completed";


                if (
                    status === "Cancelled"
                )
                    return "status-cancelled";


                return "";

            };

    }
);



// =====================================================
// PARKING CONTROLLER
// =====================================================

app.controller(
    "ParkingController",
    function (
        $scope,
        ParkingService
    ) {


        $scope.slots =
            ParkingService.getSlots();


        $scope.floorFilter =
            "All";


        $scope.selectedSlot =
            null;


        // -----------------------------------------
        // SELECT SLOT
        // -----------------------------------------

        $scope.selectSlot =
            function (slot) {

                if (
                    slot.status !==
                    "available"
                ) {

                    return;

                }


                $scope.selectedSlot =
                    slot;

            };


        // -----------------------------------------
        // FLOOR FILTER
        // -----------------------------------------

        $scope.showSlot =
            function (slot) {

                if (
                    $scope.floorFilter ===
                    "All"
                ) {

                    return true;

                }


                return (
                    slot.floor ===
                    $scope.floorFilter
                );

            };


        // -----------------------------------------
        // COUNTS
        // -----------------------------------------

        $scope.getAvailableCount =
            function () {

                return $scope.slots.filter(
                    function (slot) {

                        return (
                            slot.status ===
                            "available"
                        );

                    }
                ).length;

            };


        $scope.getReservedCount =
            function () {

                return $scope.slots.filter(
                    function (slot) {

                        return (
                            slot.status ===
                            "reserved"
                        );

                    }
                ).length;

            };


        $scope.getOccupiedCount =
            function () {

                return $scope.slots.filter(
                    function (slot) {

                        return (
                            slot.status ===
                            "occupied"
                        );

                    }
                ).length;

            };

    }
);



// =====================================================
// BOOKING CONTROLLER
// =====================================================

app.controller(
    "BookingController",
    function (
        $scope,
        ParkingService,
        $location
    ) {


        $scope.slots =
            ParkingService.getSlots();


        $scope.booking = {

            vehicleType: "",

            slotId: "",

            duration: 1

        };


        // -----------------------------------------
        // AVAILABLE SLOTS
        // -----------------------------------------

        $scope.getAvailableSlots =
            function () {

                if (
                    !$scope.booking.vehicleType
                ) {

                    return [];

                }


                return $scope.slots.filter(
                    function (slot) {

                        return (
                            slot.status ===
                            "available" &&

                            slot.type ===
                            $scope.booking.vehicleType
                        );

                    }
                );

            };


        // -----------------------------------------
        // CALCULATE FEE
        // -----------------------------------------

        $scope.calculateFee =
            function () {

                var type =
                    $scope.booking.vehicleType;


                var duration =
                    Number(
                        $scope.booking.duration
                    );


                if (
                    !type ||
                    !duration ||
                    duration < 1
                ) {

                    return 0;

                }


                // CAR

                if (
                    type === "Car"
                ) {

                    if (
                        duration <= 2
                    )
                        return 30;


                    if (
                        duration <= 5
                    )
                        return 50;


                    if (
                        duration <= 10
                    )
                        return 80;


                    return 120;

                }


                // TWO WHEELER

                if (
                    type ===
                    "Two Wheeler"
                ) {

                    if (
                        duration <= 2
                    )
                        return 15;


                    if (
                        duration <= 5
                    )
                        return 25;


                    if (
                        duration <= 10
                    )
                        return 40;


                    return 60;

                }


                return 0;

            };


        // -----------------------------------------
        // BOOK PARKING
        // -----------------------------------------

        $scope.bookParking =
            function (form) {


                if (
                    form.$invalid
                ) {

                    alert(
                        "Please fill all required fields."
                    );

                    return;

                }


                var slot =
                    ParkingService.getSlot(
                        $scope.booking.slotId
                    );


                if (!slot) {

                    alert(
                        "Please select a parking slot."
                    );

                    return;

                }


                if (
                    slot.status !==
                    "available"
                ) {

                    alert(
                        "This slot is no longer available."
                    );

                    $scope.slots =
                        ParkingService.getSlots();

                    return;

                }


                var now =
                    new Date();


                var booking = {

                    vehicleType:
                        $scope.booking
                            .vehicleType,

                    slotId:
                        slot.id,

                    slotNumber:
                        slot.slotNumber,

                    floor:
                        slot.floor,

                    duration:
                        Number(
                            $scope.booking
                                .duration
                        ),

                    fee:
                        $scope.calculateFee(),

                    status:
                        "Reserved",

                    createdAt:
                        now.toLocaleString(),

                    createdTimestamp:
                        now.getTime()

                };


                ParkingService.addBooking(
                    booking
                );


                ParkingService.updateStatus(
                    slot.id,
                    "reserved"
                );


                alert(
                    "Parking booked successfully!"
                );


                $location.path(
                    "/bookings"
                );

            };

    }
);



// =====================================================
// BOOKINGS CONTROLLER
// =====================================================

app.controller(
    "BookingsController",
    function (
        $scope,
        ParkingService
    ) {


       $scope.bookings =
    ParkingService.getBookings()
        .slice()
        .sort(function (a, b) {
            var timeA = Number(a.createdTimestamp) || 0;
            var timeB = Number(b.createdTimestamp) || 0;

            return timeB - timeA;
        });


        $scope.searchText =
            "";


        $scope.statusFilter =
            "All";


        $scope.selectedBooking =
            null;


        // -----------------------------------------
        // FILTER BOOKINGS
        // -----------------------------------------

        $scope.filterBookings =
            function (booking) {

                var search =
                    (
                        $scope.searchText ||
                        ""
                    ).toLowerCase();


                var bookingId =
                    (
                        booking.bookingId ||
                        ""
                    ).toLowerCase();


                var slotNumber =
                    (
                        booking.slotNumber ||
                        ""
                    ).toLowerCase();


                var vehicleType =
                    (
                        booking.vehicleType ||
                        ""
                    ).toLowerCase();


                var matchesSearch =
                    !search ||

                    bookingId
                        .includes(search) ||

                    slotNumber
                        .includes(search) ||

                    vehicleType
                        .includes(search);


                var matchesStatus =
                    $scope.statusFilter ===
                    "All" ||

                    booking.status ===
                    $scope.statusFilter;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            };


        // -----------------------------------------
        // VIEW BOOKING
        // -----------------------------------------

        $scope.viewBooking =
            function (booking) {

                $scope.selectedBooking =
                    booking;

            };


        $scope.closeDetails =
            function () {

                $scope.selectedBooking =
                    null;

            };


        // -----------------------------------------
        // CANCEL
        // -----------------------------------------

        $scope.cancelBooking =
            function (booking) {

                if (
                    !confirm(
                        "Cancel booking " +
                        booking.bookingId +
                        "?"
                    )
                ) {

                    return;

                }


                ParkingService.cancelBooking(
                    booking.id
                );


                $scope.bookings =
                    ParkingService.getBookings();


                $scope.selectedBooking =
                    null;


                alert(
                    "Booking cancelled successfully."
                );

            };


        // -----------------------------------------
        // CHECK-IN
        // -----------------------------------------

        $scope.checkIn =
            function (booking) {

                if (
                    !confirm(
                        "Check-in for " +
                        booking.vehicleType +
                        " at slot " +
                        booking.slotNumber +
                        "?"
                    )
                ) {

                    return;

                }


                ParkingService.checkIn(
                    booking.id
                );


                $scope.bookings =
                    ParkingService.getBookings();


                alert(
                    "Vehicle checked in successfully!"
                );

            };


        // -----------------------------------------
        // BASE FEE
        // -----------------------------------------

        $scope.calculateBaseFee =
            function (booking) {

                var duration =
                    Number(
                        booking.duration
                    );


                if (
                    booking.vehicleType ===
                    "Car"
                ) {

                    if (
                        duration <= 2
                    )
                        return 30;


                    if (
                        duration <= 5
                    )
                        return 50;


                    if (
                        duration <= 10
                    )
                        return 80;


                    return 120;

                }


                if (
                    booking.vehicleType ===
                    "Two Wheeler"
                ) {

                    if (
                        duration <= 2
                    )
                        return 15;


                    if (
                        duration <= 5
                    )
                        return 25;


                    if (
                        duration <= 10
                    )
                        return 40;


                    return 60;

                }


                return 0;

            };


        // -----------------------------------------
        // CALCULATE FINAL BILL
        // -----------------------------------------

        $scope.calculateParkingBill =
            function (booking) {


                if (
                    !booking.checkInTimestamp
                ) {

                    return null;

                }


                var checkIn =
                    Number(
                        booking.checkInTimestamp
                    );


                var checkOut =
                    new Date().getTime();


                var difference =
                    checkOut -
                    checkIn;


                var actualHours =
                    Math.ceil(
                        difference /
                        (1000 * 60 * 60)
                    );


                if (
                    actualHours < 1
                ) {

                    actualHours = 1;

                }


                var bookedHours =
                    Number(
                        booking.duration
                    );


                var extraHours =
                    Math.max(
                        0,
                        actualHours -
                        bookedHours
                    );


                var baseFee =
                    $scope.calculateBaseFee(
                        booking
                    );


                var extraRate =
                    0;


                if (
                    booking.vehicleType ===
                    "Car"
                ) {

                    extraRate = 20;

                }


                else if (
                    booking.vehicleType ===
                    "Two Wheeler"
                ) {

                    extraRate = 10;

                }


                var extraCharge =
                    extraHours *
                    extraRate;


                var finalFee =
                    baseFee +
                    extraCharge;


                return {

                    actualHours:
                        actualHours,

                    bookedHours:
                        bookedHours,

                    extraHours:
                        extraHours,

                    baseFee:
                        baseFee,

                    extraRate:
                        extraRate,

                    extraCharge:
                        extraCharge,

                    finalFee:
                        finalFee

                };

            };


       
/* =====================================
   DEMO / TEST TIME BILL PREVIEW
   Preview only — does not change bookings.
===================================== */

$scope.demoBooking = null;
$scope.demoTime = {
    actualHours: 1
};
$scope.demoBill = null;

$scope.openDemoTime = function (booking) {
    if (!booking || booking.status !== "Occupied") {
        return;
    }

    $scope.demoBooking = booking;

    $scope.demoTime.actualHours = Math.max(
        1,
        Number(booking.duration) || 1
    );

    $scope.updateDemoBill();
};

$scope.updateDemoBill = function () {
    if (!$scope.demoBooking) {
        $scope.demoBill = null;
        return;
    }

    var enteredHours = Number($scope.demoTime.actualHours);

    if (!isFinite(enteredHours) || enteredHours < 1) {
        $scope.demoBill = null;
        return;
    }

    var actualHours = Math.ceil(enteredHours);

    var bookedHours = Math.max(
        1,
        Number($scope.demoBooking.duration) || 1
    );

    var extraHours = Math.max(
        0,
        actualHours - bookedHours
    );

    var baseFee = $scope.calculateBaseFee(
        $scope.demoBooking
    );

    var extraRate =
        $scope.demoBooking.vehicleType === "Car"
            ? 20
            : 10;

    var extraCharge = extraHours * extraRate;

    $scope.demoBill = {
        bookedHours: bookedHours,
        actualHours: actualHours,
        extraHours: extraHours,
        baseFee: baseFee,
        extraRate: extraRate,
        extraCharge: extraCharge,
        finalFee: baseFee + extraCharge
    };
};

$scope.closeDemoTime = function () {
    $scope.demoBooking = null;
    $scope.demoBill = null;
};


        // -----------------------------------------
        // CHECK-OUT
        // -----------------------------------------

        $scope.checkOut =
            function (booking) {


                var bill =
                    $scope.calculateParkingBill(
                        booking
                    );


                if (!bill) {

                    alert(
                        "Check-in information not found."
                    );

                    return;

                }


                var message =

                    "PARKING BILL\n\n" +

                    "Booking ID: " +
                    booking.bookingId +

                    "\nVehicle Type: " +
                    booking.vehicleType +

                    "\nParking Slot: " +
                    booking.slotNumber +

                    "\nBooked Duration: " +
                    bill.bookedHours +
                    " hour(s)" +

                    "\nActual Duration: " +
                    bill.actualHours +
                    " hour(s)" +

                    "\nExtra Hours: " +
                    bill.extraHours +

                    "\nBase Charge: ₹" +
                    bill.baseFee +

                    "\nExtra Charge: ₹" +
                    bill.extraCharge +

                    "\n\nFINAL AMOUNT: ₹" +
                    bill.finalFee +

                    "\n\nProceed with Check-Out?";


                if (
                    confirm(message)
                ) {


                    ParkingService.checkOut(
                        booking.id,
                        bill
                    );


                    $scope.bookings =
                        ParkingService.getBookings();


                    alert(
                        "Check-out completed successfully!\n" +
                        "Final Amount: ₹" +
                        bill.finalFee
                    );

                }

            };


        // -----------------------------------------
        // STATISTICS
        // -----------------------------------------

        $scope.getTotalBookings =
            function () {

                return $scope.bookings.length;

            };


        $scope.getActiveBookings =
            function () {

                return $scope.bookings.filter(
                    function (booking) {

                        return (
                            booking.status ===
                            "Reserved" ||

                            booking.status ===
                            "Occupied"
                        );

                    }
                ).length;

            };


        $scope.getCancelledBookings =
            function () {

                return $scope.bookings.filter(
                    function (booking) {

                        return (
                            booking.status ===
                            "Cancelled"
                        );

                    }
                ).length;

            };


        $scope.getStatusClass =
            function (status) {

                if (
                    status === "Reserved"
                )
                    return "status-reserved";


                if (
                    status === "Occupied"
                )
                    return "status-occupied";


                if (
                    status === "Completed"
                )
                    return "status-completed";


                if (
                    status === "Cancelled"
                )
                    return "status-cancelled";


                return "";

            };

    }
);



// =====================================================
// CHARGES CONTROLLER
// =====================================================

app.controller(
    "ChargesController",
    function (
        $scope,
        ParkingService
    ) {


        $scope.bookings =
            ParkingService.getBookings();


       
$scope.completedBookings =
    $scope.bookings
        .filter(function (booking) {
            return booking.status === "Completed";
        })
        .slice()
        .sort(function (a, b) {
            var timeA = Number(a.createdTimestamp) || 0;
            var timeB = Number(b.createdTimestamp) || 0;

            return timeB - timeA;
        });



        $scope.selectedInvoice =
            null;


        // -----------------------------------------
        // VIEW INVOICE
        // -----------------------------------------

        $scope.viewInvoice =
            function (booking) {

                $scope.selectedInvoice =
                    booking;

            };


        // -----------------------------------------
        // CLOSE
        // -----------------------------------------

        $scope.closeInvoice =
            function () {

                $scope.selectedInvoice =
                    null;

            };

    }
);



// =====================================================
// REPORTS CONTROLLER
// =====================================================

app.controller(
    "ReportsController",
    function (
        $scope,
        ParkingService,
        $timeout
    ) {


        $scope.slots =
            ParkingService.getSlots();


        $scope.bookings =
            ParkingService.getBookings();


        // -----------------------------------------
        // SLOT STATISTICS
        // -----------------------------------------

        $scope.getAvailable =
            function () {

                return $scope.slots.filter(
                    function (slot) {

                        return (
                            slot.status ===
                            "available"
                        );

                    }
                ).length;

            };


        $scope.getReserved =
            function () {

                return $scope.slots.filter(
                    function (slot) {

                        return (
                            slot.status ===
                            "reserved"
                        );

                    }
                ).length;

            };


        $scope.getOccupied =
            function () {

                return $scope.slots.filter(
                    function (slot) {

                        return (
                            slot.status ===
                            "occupied"
                        );

                    }
                ).length;

            };


        // -----------------------------------------
        // BOOKING STATISTICS
        // -----------------------------------------

        $scope.getReservedBookings =
            function () {

                return $scope.bookings.filter(
                    function (booking) {

                        return (
                            booking.status ===
                            "Reserved"
                        );

                    }
                ).length;

            };


        $scope.getOccupiedBookings =
            function () {

                return $scope.bookings.filter(
                    function (booking) {

                        return (
                            booking.status ===
                            "Occupied"
                        );

                    }
                ).length;

            };


        $scope.getCompleted =
            function () {

                return $scope.bookings.filter(
                    function (booking) {

                        return (
                            booking.status ===
                            "Completed"
                        );

                    }
                ).length;

            };


        $scope.getCancelled =
            function () {

                return $scope.bookings.filter(
                    function (booking) {

                        return (
                            booking.status ===
                            "Cancelled"
                        );

                    }
                ).length;

            };


        // -----------------------------------------
        // REVENUE
        // -----------------------------------------

        $scope.getRevenue =
            function () {

                var revenue = 0;


                $scope.bookings.forEach(
                    function (booking) {

                        if (
                            booking.status ===
                            "Completed"
                        ) {

                            revenue += Number(
                                booking.finalFee ||
                                0
                            );

                        }

                    }
                );


                return revenue;

            };


        // -----------------------------------------
        // UTILIZATION
        // -----------------------------------------

        $scope.getUtilization =
            function () {

                if (
                    $scope.slots.length === 0
                ) {

                    return 0;

                }


                var used =
                    $scope.getOccupied() +
                    $scope.getReserved();


                return Math.round(
                    (
                        used /
                        $scope.slots.length
                    ) * 100
                );

            };


        // -----------------------------------------
        // CREATE CHARTS
        // -----------------------------------------

        $timeout(
            function () {

                createBookingChart();

                createRevenueChart();

            },
            300
        );


        // -----------------------------------------
        // BOOKING STATUS CHART
        // -----------------------------------------

        function createBookingChart() {


            var canvas =
                document.getElementById(
                    "bookingStatusChart"
                );


            if (!canvas) {

                return;

            }


            var ctx =
                canvas.getContext("2d");


            new Chart(
                ctx,
                {

                    type: "doughnut",

                    data: {

                        labels: [

                            "Reserved",

                            "Occupied",

                            "Completed",

                            "Cancelled"

                        ],

                        datasets: [

                            {

                                data: [

                                    $scope
                                        .getReservedBookings(),

                                    $scope
                                        .getOccupiedBookings(),

                                    $scope
                                        .getCompleted(),

                                    $scope
                                        .getCancelled()

                                ]

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        plugins: {

                            legend: {

                                position: "bottom"

                            }

                        }

                    }

                }
            );

        }


        // -----------------------------------------
        // REVENUE CHART
        // -----------------------------------------

        function createRevenueChart() {


            var canvas =
                document.getElementById(
                    "revenueChart"
                );


            if (!canvas) {

                return;

            }


            var completed =
                $scope.bookings.filter(
                    function (booking) {

                        return (
                            booking.status ===
                            "Completed"
                        );

                    }
                );


            var labels =
                completed.map(
                    function (booking) {

                        return booking.bookingId;

                    }
                );


            var values =
                completed.map(
                    function (booking) {

                        return Number(
                            booking.finalFee ||
                            0
                        );

                    }
                );


            var ctx =
                canvas.getContext("2d");


            new Chart(
                ctx,
                {

                    type: "bar",

                    data: {

                        labels: labels,

                        datasets: [

                            {

                                label:
                                    "Revenue (₹)",

                                data:
                                    values

                            }

                        ]

                    },

                    options: {

                        responsive: true,

                        maintainAspectRatio: false,

                        scales: {

                            y: {

                                beginAtZero: true

                            }

                        }

                    }

                }
            );

        }

    }
);