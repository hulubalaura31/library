import React, { useState, useEffect }  from "react";

const Table = (props) => {
    const [books, setBooks] = useState(props.props);
    console.log(props.props)
    return (
        <div style={{ "display": "grid" }}>
            <div className="container-table100">
                <div className="wrap-table2">
                    <div className="table">
                        <div className="row2 header2">
                            <div className="cell2">
                                Code
                            </div>
                            <div className="cell2">
                                Title
                            </div>
                            <div className="cell2">
                                ISBN
                            </div>
                            <div className="cell2">
                                Price
                            </div>
                            {books ? books.map((l) => (
                                <div className="row2">
                                    <div className="cell2" data-title="Code">
                                        {l.code}
                                    </div>
                                    <div className="cell2" data-title="Title">
                                        {l.title}
                                    </div>
                                    <div className="cell2" data-title="AAAAAA">
                                        {l.ISBN}
                                    </div>
                                    <div className="cell2" data-title="Price">
                                        {l.price}
                                    </div>
                                </div>
                            )) : <></>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Table;