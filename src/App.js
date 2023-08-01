import React, { useEffect, useState } from 'react';
import axios from "axios"

function App() {
  const [userListData, setuserListData] = useState([])
  const [user, setuser] = useState({})
  const [userEdit, setuserEdit] = useState({})
  const [userNew, setuserNew] = useState({})

  const getUserListData = async () => {
    const result = await axios.get("http://localhost:5000/api/user/allUserList")
    console.log(result.data.data);
    setuserListData(result.data.data)
  }
  useEffect(() => {
    getUserListData()
  }, [])

  const HandleDeleteUser = async (id) => {
    await axios.post("http://localhost:5000/api/user/deleteUser", { _id: id })
    getUserListData()
  }
  const HandleCreateNewUser = async (item) => {
    await axios.post("http://localhost:5000/api/user/createUser", item)
    getUserListData()
    setuserNew({})
  }
  const HandleEditUser = async (item) => {
    await axios.post("http://localhost:5000/api/user/updateUser", item)
    getUserListData()
  }
  const HandleApplyForLeaveUser = async (item) => {
    await axios.post("http://localhost:5000/api/user/applyForLeave", {
      _id: item._id,
      userName: item.userName,
      email: item.email,
      phone: item.phone,
      leave: item.leave
    })
    getUserListData()
  }
  const formatDate = (date) => {
    const selectedDate = date.split("-")
    const formattedDate = selectedDate.join(",")
    return formattedDate
  }
  const handleOnchangeEvent = (e) => {
    setuserEdit({ ...userEdit, [e.target.name]: e.target.value })
  }
  const handleOnchangeEventNew = (e) => {
    setuserNew({ ...userNew, [e.target.name]: e.target.value })
  }
  return (
    <div className='containers'>
      <h2>
        User List Data
      </h2>

      <div className='divFlex'>
        <div style={{ width: "29%" }}>
          <div className='card'>
            <div className='card-body'>
              <label>UsreName :</label>
              <input autoComplete='true' className='form-control' value={userNew.userName} name="userName" type='text' onChange={handleOnchangeEventNew} />
              <label>Email :</label>
              <input  autoComplete='true' className='form-control' value={userNew.email} name="email" type='email' onChange={handleOnchangeEventNew} />
              <label>Phone :</label>
              <input   autoComplete='true' className='form-control' value={userNew.phone} name='phone' type='number' onChange={handleOnchangeEventNew} />
              <button className='btn btn-dark w-100 mt-4' onClick={()=>{

                HandleCreateNewUser(userNew)
              }} >create New</button>
            </div>
          </div>
        </div>
       <div className='card' style={{width:"70%"}}>
        <div className='card-body'>
        <table className='table table ml-4 ' style={{width:"100%"}}>
          <thead>
            <tr style={{ textTransform: "uppercase", backgroundColor: "grey", color: "black", fontSize: "18px", fontWeight: "600" }}>
              <td>Sr.no</td>
              <td>userName</td>
              <td>Email</td>
              <td>Phone</td>
              <td></td>
              <td>Date</td>
            </tr>
          </thead>
          <tbody>
            {
              userListData.length > 0 ?
                userListData.map((item, i) => {
                  return (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item.userName}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>
                        <button onClick={() => setuserEdit({
                          userName: item.userName,
                          email: item.email,
                          phone: item.phone,
                          _id: item._id
                        })} type="button" data-bs-toggle="modal"  className='btn btn-dark w-25 uppercase' data-bs-target="#exampleModal1">edit</button>
                        <button className='btn btn-dark w-25' onClick={() => HandleDeleteUser(item._id)}>delete</button>
                        {
                          item.leave === "" ? <button onClick={() => {
                            setuser(item)
                          }} className='btn btn-danger btnRed' type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">apply Leave</button> : null
                        }
                      </td>
                      <td>
                        {item.leave}
                      </td>
                    </tr>
                  )
                }) :
                <h1>User Data Not Found</h1>
            }

          </tbody>

        </table>
        </div>
       </div>
      </div>
      {/* model for apply leave */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title text-danger fs-5" id="exampleModalLabel">Apply for Leave</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <input className='form-control' type='date' onChange={(e) => {
                setuser({ ...user, leave: formatDate(e.target.value) })
              }} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary w-25" data-bs-dismiss="modal">Close</button>
              <button type="button" onClick={() => HandleApplyForLeaveUser(user)} data-bs-dismiss="modal" aria-label="Close" className="btn btn-danger w-25">Apply</button>
            </div>
          </div>
        </div>
      </div>
      {/* model for edit Data */}
      <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title text-danger fs-5" id="exampleModalLabel1">Update User Data</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <label>UsreName :</label>
              <input className='form-control' value={userEdit.userName} name="userName" type='text' onChange={handleOnchangeEvent} />
              <label>Email :</label>
              <input className='form-control' value={userEdit.email} name="email" type='email' onChange={handleOnchangeEvent} />
              <label>Phone :</label>
              <input className='form-control' value={userEdit.phone} name='phone' type='number' onChange={handleOnchangeEvent} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary w-25" data-bs-dismiss="modal">Close</button>
              <button type="button" onClick={() => {
                HandleEditUser(userEdit)
              }} data-bs-dismiss="modal" aria-label="Close" className="btn btn-danger w-25">Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App