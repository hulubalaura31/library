import React, { useState, useEffect } from "react";
import { getInitialBooks } from '../configuration/booksInitialConfig';
import { getInitialLentBooks } from '../configuration/lentBooksInitialConfig';
import Table from '../Components/Table';
import lib from '../images/lib.png';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { InputText } from 'primereact/inputtext';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const Home = () => {
    //////books not refreshed 
    const [books, setBooks] = useState(null);
    const [borrowedBooks, setBorrowedBooks] = useState(null);
    const [retrieve, setRetrieve] = useState(false);
    const [filterBooks, setFilterBooks] = useState(false);
    const [borrowBook, setBorrowBook] = useState(false);
    const [returnBook, setReturnBook] = useState(false);
    const [open, setOpen] = useState(false);
    const [code, setCode] = useState('')
    const [title, setTitle] = useState('')
    const [isbn, setISBN] = useState('')
    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [noOfBooks, setNoOfBooks] = useState(0)
    const [paymentValue, setPaymentValue] = useState(0)
    const [date, setDate] = useState(dayjs(new Date()));
    const [returnDate, setReturnDate] = useState(dayjs(new Date()));
    useEffect(() => {
        const booksData = getInitialBooks();
        setBooks(booksData);
    }, [])

    useEffect(() => {
        const booksData = getInitialLentBooks();
        setBorrowedBooks(booksData);
    }, [])

    const handleChange = (newValue) => {
        setDate(newValue);
    };


    const handleClose = () => {
        setOpen(false);
    };

    const onPressCloseBorrowDialog = () => {
        setBorrowBook(false);
    };

    const clearInputs = () => {
        setCode('');
        setISBN('');
        setPrice(0);
        setTitle('');
        setRetrieve(false)
    };

    const clearInputForBorrowDialog = () => {
        setCode('');
        setName('');
        setDate(dayjs(new Date()));
        setISBN('');
    }

    const handleBorrowBook = () => {
        if (name === '' && code === '' && isbn === '') {
            alert("Please fill all the inputs.");
            return;
        } else {
            var validCode = books.filter(x => x.code == code);
            if (validCode.length == 0) {
                alert("Invalid code.");
                return;
            } else {
                var isBorrowed = borrowedBooks.filter(x => x.code == code);
                if (isBorrowed.length > 0) {
                    alert("This book is already lent to someone");
                    return;
                } else {
                    var oNewBorrowedBook = {
                        "code": code,
                        "name": name,
                        "ISBN": isbn,
                        "date": date
                    }
                    var oItems = [...borrowedBooks];
                    oItems.push(oNewBorrowedBook);
                    setBorrowedBooks(oItems)
                    clearInputForBorrowDialog()
                    setBorrowBook(false);
                }
            }
        }
    }

    const getAvailableCopies = (e) => {
        var oValue = e.target.value;
        var allBooks = books.filter(x => x.ISBN == oValue).length;
        var oNotAvailable = borrowedBooks.filter(x => x.ISBN == oValue).length;
        console.log(allBooks - oNotAvailable)
        setNoOfBooks(allBooks - oNotAvailable);
    }


    const handleAddBook = () => {
        if (code !== '' && title !== '' && isbn !== '' && price !== 0) {
            var oFilteredBooks = books.filter(x => x.code == code);
            var isUnique = oFilteredBooks.length == 0 ? true : false;
            if (!isUnique) {
                alert("Please add an unique code.");
                return;
            } else {
                var newBook = {
                    "code": code,
                    "title": title,
                    "ISBN": isbn,
                    "price": price
                }
                var newArrBooks = [...books];
                newArrBooks.push(newBook);
                setBooks(newArrBooks);
                clearInputs();
                setOpen(false);
            }
        } else {
            alert("Please fill all the inputs.");
            return;
        }
    };

    const onPressCloseFilteringDialog = () => {
        setFilterBooks(false);
        setISBN('');
        setNoOfBooks(0);
    }

    const days = (date_1, date_2) => {
        let difference = date_1.getTime() - date_2.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;
    }

    const onPressCloseReturnDialog = () => {
        setISBN('');
        setReturnBook(false);
        setReturnDate(dayjs(new Date()));
        setPaymentValue(0);
    }

    const onPressReturnBookDialog = () => {
        if (code == '') {
            alert("Please fill all the inputs.");
            return;
        } else {
            var oBook = books.filter(x => x.code == code)[0];
            if (oBook.length == 0) {
                alert("Invalid code.");
                return;
            } else {
                var oLentBook = borrowedBooks.filter(x => x.code == code)[0];
                var oStartDate = new Date(oLentBook.date);
                var oEndDate = new Date(date);
                var numberOfDays = days(oStartDate, oEndDate);
                if (Math.abs(numberOfDays) <= 14) {
                    setPaymentValue(oBook.price)
                } else {
                    setPaymentValue(oBook.price + (oBook.price * 0.01 * Math.abs(numberOfDays)))
                }
            }
        }
    }

    return (
        <>
            <div className="container">
                <nav className="Nav" >
                    <button className="headerButton" onClick={() => setOpen(true)}>Add a book</button>
                    <button className="headerButton" onClick={() => setRetrieve(true)}>Retrieve books</button>
                    <button className="headerButton" onClick={() => setFilterBooks(true)}>Get available books</button>
                    <button className="headerButton" onClick={() => setBorrowBook(true)}>Borrow a book</button>
                    <button className="headerButton" onClick={() => setReturnBook(true)}>Return a book</button>
                </nav>
            </div>
            {filterBooks ? (
                <Dialog open={filterBooks} onClose={() => onPressCloseFilteringDialog()}>
                    <DialogTitle>Get the number of available copies for a book</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please use the ISBN of the book.
                        </DialogContentText>
                        <TextField
                            autoFocus margin="dense" label="ISBN..." type="required" fullWidth variant="standard"
                            onChange={(e) => {
                                getAvailableCopies(e);
                            }} />
                        <TextField autoFocus margin="dense" label="Number of copies..." value={noOfBooks} fullWidth variant="standard" />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { onPressCloseFilteringDialog() }}>Close</Button>
                    </DialogActions>
                </Dialog>
            ) : <></>}
            {retrieve ? (<Table props={books} />
            ) : <img src={lib} alt="library" style={{ "height": "600px" }} />}
            <Dialog open={open} onClose={() => handleClose()}>
                <DialogTitle>Add a new book</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        All the fields are required.
                    </DialogContentText>
                    <TextField
                        autoFocus margin="dense" id="code" label="Unique code" type="required" fullWidth variant="standard"
                        onChange={(e) => {
                            setCode(e.target.value);
                        }} />
                    <TextField
                        autoFocus margin="dense" id="title" label="Title" type="required" fullWidth variant="standard"
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }} />
                    <TextField
                        autoFocus margin="dense" id="isbn" label="ISBN" type="required" fullWidth variant="standard"
                        onChange={(e) => {
                            setISBN(e.target.value);
                        }} />
                    <TextField
                        autoFocus margin="dense" id="price" label="Price" type="required" fullWidth variant="standard"
                        onChange={(e) => {
                            setPrice(e.target.value);
                        }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleAddBook()} >Add</Button>
                    <Button onClick={() => { handleClose(); clearInputs() }}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={borrowBook} onClose={() => onPressCloseBorrowDialog()}>
                <DialogTitle>Borrow a book</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        All the fields are required.
                    </DialogContentText>
                    <TextField
                        autoFocus margin="dense" label="Unique code" type="required" fullWidth variant="standard"
                        onChange={(e) => {
                            setCode(e.target.value);
                        }} />
                    <TextField
                        autoFocus margin="dense" label="Name" type="required" fullWidth variant="standard"
                        onChange={(e) => {
                            setName(e.target.value);
                        }} />
                    <TextField
                        autoFocus margin="dense" label="ISBN" type="required" fullWidth variant="standard"
                        onChange={(e) => {
                            setISBN(e.target.value);
                        }} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Starting date"
                            inputFormat="DD/MM/YYYY"
                            value={date}
                            onChange={handleChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleBorrowBook()} >Borrow</Button>
                    <Button onClick={() => { onPressCloseBorrowDialog(); clearInputForBorrowDialog() }}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={returnBook} onClose={() => onPressCloseReturnDialog()}>
                <DialogTitle>Return a book</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please fill all the inputs.
                    </DialogContentText>
                    <TextField
                        autoFocus margin="dense" label="Code" type="required" fullWidth variant="standard"
                        onChange={(e) => {
                            setCode(e.target.value);
                        }} />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Returning date"
                            inputFormat="DD/MM/YYYY"
                            value={date}
                            onChange={handleChange}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <TextField autoFocus margin="dense" label="Value..." value={paymentValue} fullWidth variant="standard" />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { onPressReturnBookDialog() }}>Calculate</Button>
                    <Button onClick={() => { onPressCloseReturnDialog() }}>Close</Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

export default Home;