app.service(
    "ParkingService",
    function () {


        var SLOT_KEY =
            "smartParkSlots";


        var BOOKING_KEY =
            "smartParkBookings";


        // =====================================
        // CREATE INITIAL PARKING SLOTS
        // =====================================

        function createInitialSlots() {

            var slots = [];

            var floors = [
                "Ground Floor",
                "First Floor"
            ];


            var slotId = 1;


            for (var floor = 0; floor < floors.length; floor++) {


                for (var i = 1; i <= 25; i++) {


                    var number =
                        i < 10
                            ? "0" + i
                            : i;


                    slots.push({

                        id: slotId,

                        slotNumber:
                            (floor === 0 ? "A" : "B")
                            + number,

                        floor:
                            floors[floor],

                        type:
                            i <= 20
                                ? "Car"
                                : "Two Wheeler",

                        status:
                            "available"

                    });


                    slotId++;

                }

            }


            localStorage.setItem(
                SLOT_KEY,
                JSON.stringify(slots)
            );


            return slots;
        }


        // =====================================
        // GET SLOTS
        // =====================================

        this.getSlots = function () {

            var data =
                localStorage.getItem(SLOT_KEY);


            if (!data) {

                return createInitialSlots();

            }


            return JSON.parse(data);

        };


        // =====================================
        // SAVE SLOTS
        // =====================================

        this.saveSlots = function (slots) {

            localStorage.setItem(
                SLOT_KEY,
                JSON.stringify(slots)
            );

        };


        // =====================================
        // GET SINGLE SLOT
        // =====================================

        this.getSlot = function (id) {

            var slots =
                this.getSlots();


            for (
                var i = 0;
                i < slots.length;
                i++
            ) {

                if (slots[i].id == id) {

                    return slots[i];

                }

            }


            return null;

        };


        // =====================================
        // UPDATE SLOT STATUS
        // =====================================

        this.updateStatus = function (
            id,
            status
        ) {

            var slots =
                this.getSlots();


            for (
                var i = 0;
                i < slots.length;
                i++
            ) {

                if (slots[i].id == id) {

                    slots[i].status =
                        status;

                    break;

                }

            }


            this.saveSlots(slots);

        };


        // =====================================
        // GET BOOKINGS
        // =====================================

        this.getBookings = function () {

            var data =
                localStorage.getItem(
                    BOOKING_KEY
                );


            if (!data) {

                return [];

            }


            return JSON.parse(data);

        };


        // =====================================
        // SAVE BOOKINGS
        // =====================================

        this.saveBookings = function (
            bookings
        ) {

            localStorage.setItem(
                BOOKING_KEY,
                JSON.stringify(bookings)
            );

        };


        // =====================================
        // ADD BOOKING
        // =====================================

        this.addBooking = function (
            booking
        ) {

            var bookings =
                this.getBookings();


            booking.id =
                Date.now();


            booking.bookingId =
                "SP" +
                Math.floor(
                    100000 +
                    Math.random() * 900000
                );


            bookings.push(
                booking
            );


            this.saveBookings(
                bookings
            );

        };


        // =====================================
        // CANCEL BOOKING
        // =====================================

        this.cancelBooking = function (
            id
        ) {

            var bookings =
                this.getBookings();


            for (
                var i = 0;
                i < bookings.length;
                i++
            ) {

                if (
                    bookings[i].id == id
                ) {

                    bookings[i].status =
                        "Cancelled";


                    this.updateStatus(
                        bookings[i].slotId,
                        "available"
                    );


                    break;

                }

            }


            this.saveBookings(
                bookings
            );

        };


        // =====================================
        // CHECK-IN
        // =====================================

        this.checkIn = function (
            bookingId
        ) {

            var bookings =
                this.getBookings();


            for (
                var i = 0;
                i < bookings.length;
                i++
            ) {

                if (
                    bookings[i].id == bookingId
                ) {

                    var now =
                        new Date();


                    bookings[i].status =
                        "Occupied";


                    bookings[i].checkInTime =
                        now.toLocaleString();


                    bookings[i].checkInTimestamp =
                        now.getTime();


                    this.updateStatus(
                        bookings[i].slotId,
                        "occupied"
                    );


                    break;

                }

            }


            this.saveBookings(
                bookings
            );

        };


        // =====================================
        // CHECK-OUT
        // =====================================

        this.checkOut = function (
            bookingId,
            bill
        ) {

            var bookings =
                this.getBookings();


            for (
                var i = 0;
                i < bookings.length;
                i++
            ) {

                if (
                    bookings[i].id == bookingId
                ) {

                    var now =
                        new Date();


                    bookings[i].status =
                        "Completed";


                    bookings[i].checkOutTime =
                        now.toLocaleString();


                    bookings[i].checkOutTimestamp =
                        now.getTime();


                    bookings[i].actualHours =
                        bill.actualHours;


                    bookings[i].extraHours =
                        bill.extraHours;


                    bookings[i].baseFee =
                        bill.baseFee;


                    bookings[i].extraCharge =
                        bill.extraCharge;


                    bookings[i].finalFee =
                        bill.finalFee;


                    this.updateStatus(
                        bookings[i].slotId,
                        "available"
                    );


                    break;

                }

            }


            this.saveBookings(
                bookings
            );

        };


    }
);