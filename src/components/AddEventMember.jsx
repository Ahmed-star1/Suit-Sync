import React, { useState, useRef } from "react";
import { FaUser, FaPen } from "react-icons/fa";

const AddEventMember = () => {
  const [role, setRole] = useState("");
  const [memberName, setMemberName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [memberImage, setMemberImage] = useState(null);
  const [members, setMembers] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMemberImage(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSaveMember = (e) => {
    e.preventDefault();

    if (!role || !memberName || !phone || !email || !memberImage) {
      alert("Please fill all fields and upload an image");
      return;
    }

    const newMember = {
      id: Date.now(),
      role,
      memberName,
      phone,
      email,
      memberImage,
    };

    setMembers([...members, newMember]);

    setRole("");
    setMemberName("");
    setPhone("");
    setEmail("");
    setMemberImage(null);
    setActiveDropdown(null);
  };

  const handleRemoveMember = (id) => {
    setMembers(members.filter((member) => member.id !== id));
    setActiveDropdown(null);
  };

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="col-md-9 right-column add-member">
      <div className="right-column-content">
        <h2>Add Event Member</h2>

        <div className="add-member-container container-fluid">
          <div className="row">
            <div className="add-member-form col-md-5">
              <h3>Add Member</h3>
              <form onSubmit={handleSaveMember}>
                <div className="upload-photo-box">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />

                  {memberImage ? (
                    <div
                      className="image-container"
                      style={{ position: "relative", cursor: "pointer" }}
                    >
                      <img
                        src={memberImage}
                        alt="member"
                        className="member-preview"
                        onClick={handleImageClick}
                      />
                      <button
                        type="button"
                        className="image-edit-btn"
                        onClick={handleImageClick}
                      >
                        <FaPen size={16} />
                      </button>
                    </div>
                  ) : (
                    <div
                      className="camera-box"
                      onClick={handleImageClick}
                      style={{ cursor: "pointer" }}
                    >
                      <img src="/Images/camera.png" alt="Upload" />
                    </div>
                  )}
                </div>

                <div className="member-form-fields">
                  <div className="field">
                    <label>Select Role</label>
                    <div className="select-field">
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                      >
                        <option value="">Select Role</option>
                        <option>Groomsman 1</option>
                        <option>Groomsman 2</option>
                        <option>Groomsman 3</option>
                      </select>
                    </div>
                  </div>

                  <div className="field">
                    <label>Member Name</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="Enter member name"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Phone</label>
                    <input
                      className="input"
                      type="text"
                      placeholder="000-000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="field">
                    <label>Email</label>
                    <input
                      className="input"
                      type="email"
                      placeholder="abc@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="designBtn2">
                    Add Member
                  </button>
                </div>
              </form>
            </div>

            <div className="member-lists col-md-7">
              <div className="member-box">
                {members.length === 0 ? (
                  <div className="empty-box">
                    <div className="camera-box">
                      <FaUser />
                    </div>
                    <h3>You Don't Have Any Member Yet</h3>
                    <p>
                      Please add the member to the form with the complete
                      details.
                    </p>
                  </div>
                ) : (
                  <div className="members-list">
                    <h3>Members List</h3>

                    <div className="members-wrapper">
                      {members.map((member) => (
                        <div key={member.id} className="member-row">
                          <div className="member-left">
                            <img
                              src={member.memberImage}
                              className="member-thumb"
                              alt={member.memberName}
                            />
                          </div>

                          <div className="member-center">
                            <h4>{member.memberName}</h4>
                            <p>{member.role}</p>
                          </div>

                          <div className="member-right">
                            <div className="dropdown-container">
                              <button
                                className="dots-btn"
                                onClick={() => toggleDropdown(member.id)}
                              >
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                              </button>

                              {activeDropdown === member.id && (
                                <div className="dropdown-menu">
                                  <button
                                    className="dropdown-item remove-btn"
                                    onClick={() => handleRemoveMember(member.id)}
                                  >
                                    Remove Member
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="buttons-row">
                <button className="designBtn2">Create Event</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventMember;