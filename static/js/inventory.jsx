"use strict";

// Inventory
const Inventory = () => {
  const session_login = document.querySelector("#login").innerText;

  const [checkIns, setCheckIns] = React.useState([]);

  if (session_login === "True") {
    React.useEffect(() => {
      getCheckIns();
    }, []);
  }

  const getCheckIns = () => {
    fetch(`/user_check_ins.json`)
      .then((response) => response.json())
      .then((data) => {
        setCheckIns(data.checkIns);
      });
  };

  const allCheckIns = [];
  const allEditCheckIns = [];

  for (const currentCheckIn of checkIns) {
    const date_hiked = new Date(currentCheckIn.date_hiked);
    const date_hiked_formatted = date_hiked.toLocaleDateString();

    allCheckIns.push(
      <CheckIn
        key={currentCheckIn.check_in_id}
        hike_id={currentCheckIn.hike_id}
        hike_name={currentCheckIn.hike["hike_name"]}
        check_in_id={currentCheckIn.check_in_id}
        date_hiked={date_hiked_formatted}
        miles_completed={currentCheckIn.miles_completed}
        total_time={currentCheckIn.total_time}
        notes={currentCheckIn.notes}
        pets_on_hike={currentCheckIn.pets}
        pets_not_on_hike={currentCheckIn.pets_not_on_hike}
        getCheckIns={getCheckIns}
      />
    );
    allEditCheckIns.push(
      <EditCheckIn
        key={currentCheckIn.check_in_id}
        hike_id={currentCheckIn.hike_id}
        check_in_id={currentCheckIn.check_in_id}
        date_hiked={date_hiked_formatted}
        miles_completed={currentCheckIn.miles_completed}
        total_time={currentCheckIn.total_time}
        notes={currentCheckIn.notes}
        pets_on_hike={currentCheckIn.pets}
        pets_not_on_hike={currentCheckIn.pets_not_on_hike}
        getCheckIns={getCheckIns}
      />
    );
  }

  return (
    <React.Fragment>
      <AddCheckIn getCheckIns={getCheckIns} />
      {allEditCheckIns}
      <div
        className="offcanvas offcanvas-end"
        style={{ width: "650px" }}
        data-bs-keyboard="true"
        data-bs-scroll="true"
        data-bs-backdrop="true"
        tabIndex="-1"
        id="CheckIns"
        aria-labelledby="CheckInsLabel"
      >
        <div className="offcanvas-header">
          <h3 className="offcanvas-title" id="CheckInsLabel">
            All Check Ins
          </h3>
          {session_login === "True" ? (
            <a
              className="btn btn-sm btn-outline-dark fw-300"
              href=""
              data-bs-toggle="modal"
              data-bs-target="#modal-add-check-in"
            >
              <i
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="add a check in"
                className="bi bi-check-circle"
              ></i>{" "}
              add a check in
            </a>
          ) : null}
        </div>

        <div className="offcanvas-body">
          {session_login !== "True" ? (
            <div className="fw-300">Please log in to add a check in.</div>
          ) : (
            <div>{allCheckIns}</div>
          )}

          <div
            className="offcanvas-footer"
            style={{
              position: "fixed",
              right: "613px",
              bottom: "10px",
              zIndex: "100",
            }}
          >
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const AllHikesCommentContainer = () => {
  const session_login = document.querySelector("#login").innerText;
  const [comments, setComments] = React.useState([]);

  if (session_login === "True") {
    React.useEffect(() => {
      getComments();
    }, []);
  }

  const getComments = () => {
    fetch(`/user_comments.json`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data.comments);
      });
  };

  const allComments = [];
  const allEditComments = [];

  for (const currentComment of comments) {
    const date_edited = new Date(currentComment.date_edited);
    const date_edited_formatted = `${date_edited.toLocaleDateString()} ${date_edited.toLocaleTimeString()}`;
    const date_created = new Date(currentComment.date_created);
    const date_created_formatted = `${date_created.toLocaleDateString()} ${date_created.toLocaleTimeString()}`;

    allComments.push(
      <Comment
        key={currentComment.comment_id}
        hike_id={currentComment.hike_id}
        hike_name={currentComment.hike.hike_name}
        comment_id={currentComment.comment_id}
        full_name={currentComment.user.full_name}
        user_id={currentComment.user_id}
        date_created={date_created_formatted}
        date_edited={date_edited_formatted}
        edit={currentComment.edit}
        comment_body={currentComment.body}
        session_login={document.querySelector("#login").innerText}
        getComments={getComments}
      />
    );

    allEditComments.push(
      <EditComment
        key={currentComment.comment_id}
        hike_id={currentComment.hike_id}
        comment_id={currentComment.comment_id}
        full_name={currentComment.user.full_name}
        user_id={currentComment.user_id}
        date_created={date_created_formatted}
        date_edited={date_edited_formatted}
        edit={currentComment.edit}
        comment_body={currentComment.body}
        getComments={getComments}
      />
    );
  }

  return (
    <React.Fragment>
      <AddComment getComments={getComments} />
      {allEditComments}
      <div
        className="offcanvas offcanvas-end"
        style={{ width: "650px" }}
        data-bs-keyboard="true"
        data-bs-scroll="true"
        data-bs-backdrop="true"
        tabIndex="-1"
        id="Comments"
        aria-labelledby="CommentsLabel"
      >
        <div className="offcanvas-header">
          <h3 className="offcanvas-title" id="CommentsLabel">
            Your Comments For All Hikes
          </h3>
          {session_login === "True" ? (
            <a
              className="btn btn-sm btn-outline-dark fw-300"
              href=""
              data-bs-toggle="modal"
              data-bs-target="#modal-add-comment"
            >
              <i
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="add a comment for any hike"
                className="bi bi-chat-text"
              ></i>{" "}
              add a comment
            </a>
          ) : null}
        </div>

        <div className="offcanvas-body">
          {session_login !== "True" ? (
            <div className="fw-300">Please log in to view your comments.</div>
          ) : (
            <div>{allComments}</div>
          )}

          <div
            className="offcanvas-footer"
            style={{
              position: "fixed",
              right: "613px",
              bottom: "10px",
              zIndex: "100",
            }}
          >
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

// Bookmarks Lists Container Component
const AllHikesBookmarksListContainer = () => {
  const session_login = document.querySelector("#login").innerText;

  const AddMultHikesToExistingListRef = React.useRef();
  const BookmarksListRef = React.useRef();

  // Set States
  const [bookmarksLists, setBookmarksLists] = React.useState([]);

  if (session_login === "True") {
    React.useEffect(() => {
      getBookmarksLists();
    }, []);
  }

  const getBookmarksLists = () => {
    fetch("/user_bookmarks_lists.json")
      .then((response) => response.json())
      .then((data) => {
        setBookmarksLists(data.bookmarksLists);
      });
  };

  const parentSetHikesOptionState = () => {
    AddMultHikesToExistingListRef.current.setHikesOptionsState();
  };

  const allBookmarksLists = [];
  const allRenameBookmarksLists = [];
  const allAddMultHikesToExistingList = [];

  const timestamp = Date.now();

  for (const currentBookmarksList of bookmarksLists) {
    allBookmarksLists.push(
      <BookmarksList
        key={currentBookmarksList.bookmarks_list_id}
        bookmarks_list_name={currentBookmarksList.bookmarks_list_name}
        bookmarks_list_id={currentBookmarksList.bookmarks_list_id}
        hikes={currentBookmarksList.hikes}
        getBookmarksLists={getBookmarksLists}
        parentSetHikesOptionState={parentSetHikesOptionState}
        ref={BookmarksListRef}
      />
    );

    allAddMultHikesToExistingList.push(
      <AddMultHikesToExistingList
        key={`${timestamp}-${currentBookmarksList.bookmarks_list_id}`}
        bookmarks_list_name={currentBookmarksList.bookmarks_list_name}
        bookmarks_list_id={currentBookmarksList.bookmarks_list_id}
        hikes={currentBookmarksList.hikes}
        getBookmarksLists={getBookmarksLists}
        ref={AddMultHikesToExistingListRef}
      />
    );

    allRenameBookmarksLists.push(
      <RenameBookmarksList
        key={currentBookmarksList.bookmarks_list_id}
        bookmarks_list_name={currentBookmarksList.bookmarks_list_name}
        bookmarks_list_id={currentBookmarksList.bookmarks_list_id}
        getBookmarksLists={getBookmarksLists}
      />
    );
  }

  return (
    <React.Fragment>
      <CreateBookmarksList getBookmarksLists={getBookmarksLists} />
      {allRenameBookmarksLists}
      {allAddMultHikesToExistingList}
      <div
        className="offcanvas offcanvas-end"
        data-bs-keyboard="true"
        data-bs-scroll="true"
        data-bs-backdrop="true"
        tabIndex="-1"
        id="Bookmarks"
        aria-labelledby="BookmarksLabel"
        style={{ width: "790px" }}
      >
        <div className="offcanvas-header">
          <h3 className="offcanvas-title" id="BookmarksLabel">
            All Bookmarks
          </h3>
          {session_login === "True" ? (
            <a
              className="btn btn-sm btn-outline-dark fw-300"
              href=""
              data-bs-toggle="modal"
              data-bs-target="#modal-create-bookmarks-list"
            >
              <i
                data-bs-toggle="tooltip"
                data-bs-placement="right"
                title="create a bookmarks list"
                className="bi bi-bookmark-star"
              ></i>{" "}
              create a list
            </a>
          ) : null}
        </div>

        <div className="offcanvas-body">
          {session_login !== "True" ? (
            <div className="fw-300">Please log in to add a bookmark.</div>
          ) : (
            <div>{allBookmarksLists}</div>
          )}
          <div
            className="offcanvas-footer"
            style={{
              position: "fixed",
              right: "757px",
              bottom: "10px",
              zIndex: "100",
            }}
          >
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const HikeTableRow = (props) => {
  return (
    <tr>
      <td>
        {props.sortParam === "name-asc" || props.sortParam === "name-desc" ? (
          <span
            className="td-hike-name d-inline-block text-truncate fw-400"
            style={{
              minWidth: 0,
              maxWidth: "400px",
            }}
          >
            <a className="link-dark" href={`/hikes/${props.hike.hike_id}`}>
              <small>{props.hike.hike_name}</small>
            </a>
          </span>
        ) : (
          <span
            className="td-hike-name d-inline-block text-truncate fw-300"
            style={{ minWidth: 0, maxWidth: "400px" }}
          >
            <a className="link-dark" href={`/hikes/${props.hike.hike_id}`}>
              <small>{props.hike.hike_name}</small>
            </a>
          </span>
        )}
      </td>
      <td>
        {props.sortParam === "difficulty-asc" ||
        props.sortParam === "difficulty-desc" ? (
          <span className="td-difficulty fw-400">
            <small>{props.hike.difficulty}</small>
          </span>
        ) : (
          <span className="td-difficulty fw-300">
            <small>{props.hike.difficulty}</small>
          </span>
        )}
      </td>
      <td>
        {props.sortParam === "length-asc" ||
        props.sortParam === "length-desc" ? (
          <span className="td-miles fw-400">
            <small>{props.hike.miles} miles</small>
          </span>
        ) : (
          <span className="td-miles fw-300">
            <small>{props.hike.miles} miles</small>
          </span>
        )}
      </td>
      <td>
        {props.sortParam === "state-asc" || props.sortParam === "state-desc" ? (
          <span className="td-state fw-400">
            <small>{props.hike.state}</small>
          </span>
        ) : (
          <span className="td-state fw-300">
            <small>{props.hike.state}</small>
          </span>
        )}
      </td>
      <td>
        {props.sortParam === "area-asc" || props.sortParam === "area-desc" ? (
          <span className="td-area fw-400">
            <small>{props.hike.area}</small>
          </span>
        ) : (
          <span className="td-area fw-300">
            <small>{props.hike.area}</small>
          </span>
        )}
      </td>
      <td>
        {props.sortParam === "city-asc" || props.sortParam === "city-desc" ? (
          <span className="td-city fw-400">
            <small>{props.hike.city}</small>
          </span>
        ) : (
          <span className="td-city fw-300">
            <small>{props.hike.city}</small>
          </span>
        )}
      </td>
      <td>
        {props.sortParam === "leashRule-asc" ||
        props.sortParam === "leashRule-desc" ? (
          <span className="td-leash-rule fw-400">
            <small>{props.hike.leash_rule}</small>
          </span>
        ) : (
          <span className="td-leash-rule fw-300">
            <small>{props.hike.leash_rule}</small>
          </span>
        )}
      </td>
      <td>
        {props.sortParam === "parking-asc" ||
        props.sortParam === "parking-desc" ? (
          <span
            className="td-parking d-inline-block text-truncate fw-400"
            style={{ maxWidth: "130px" }}
          >
            <small>{props.hike.parking}</small>
          </span>
        ) : (
          <span
            className="td-parking d-inline-block text-truncate fw-300"
            style={{ maxWidth: "130px" }}
          >
            <small>{props.hike.parking}</small>
          </span>
        )}
      </td>
    </tr>
  );
};

const InventoryTableRow = (props) => {
  return (
    <tr>
      <td>
        <span>
          <small>{props.hike.parking}</small>
        </span>
      </td>
      <td>
        <span>
          <small>{props.hike.parking}</small>
        </span>
      </td>
    </tr>
  );
};

const ShipmentsTable = (props) => {
  const [shipments, setShipments] = React.useState([]);

  if (session_login === "True") {
    React.useEffect(() => {
      getComments();
    }, []);
  }

  const getComments = () => {
    fetch(`/user_comments.json`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data.comments);
      });
  };

  const allComments = [];
  const allEditComments = [];

  for (const currentComment of comments) {
    const date_edited = new Date(currentComment.date_edited);
    const date_edited_formatted = `${date_edited.toLocaleDateString()} ${date_edited.toLocaleTimeString()}`;
    const date_created = new Date(currentComment.date_created);
    const date_created_formatted = `${date_created.toLocaleDateString()} ${date_created.toLocaleTimeString()}`;

    allComments.push(
      <Comment
        key={currentComment.comment_id}
        hike_id={currentComment.hike_id}
        hike_name={currentComment.hike.hike_name}
        comment_id={currentComment.comment_id}
        full_name={currentComment.user.full_name}
        user_id={currentComment.user_id}
        date_created={date_created_formatted}
        date_edited={date_edited_formatted}
        edit={currentComment.edit}
        comment_body={currentComment.body}
        session_login={document.querySelector("#login").innerText}
        getComments={getComments}
      />
    );

    allEditComments.push(
      <EditComment
        key={currentComment.comment_id}
        hike_id={currentComment.hike_id}
        comment_id={currentComment.comment_id}
        full_name={currentComment.user.full_name}
        user_id={currentComment.user_id}
        date_created={date_created_formatted}
        date_edited={date_edited_formatted}
        edit={currentComment.edit}
        comment_body={currentComment.body}
        getComments={getComments}
      />
    );
  }

  return <React.Fragment></React.Fragment>;
};

const InventoryTable = (props) => {
  const [inventory, setInventory] = React.useState([]);
  return <React.Fragment></React.Fragment>;
};

const InventoryShipmentsContainer = () => {
  // stuff here

  return <React.Fragment></React.Fragment>;
};

ReactDOM.render(
  <InventoryShipmentsContainer />,
  document.getElementById("root")
);
