import moment from "moment/moment";
import { useEffect, useState } from "react";
import "./users.scss";
import {
  DeleteOutlined,
  AudioOutlined,
  FormOutlined,
  UserAddOutlined,
  UserOutlined,
  ExclamationCircleFilled
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  DatePicker,
  Empty,
  Form,
  Image,
  Input,
  Modal,
  Pagination,
  Spin,
  Typography,
  message,
} from "antd";
import Search from "antd/es/input/Search";
import { request, responsiveTable } from "../../../server/request";
import { IMG_URl } from "../../../const";
const UsersPage = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgId, setImgId] = useState(null)
  const itemsPerPage = 10;

  const getPosts = async (searchQuery) => {
    try {
      setLoading(true);
      const response = await request.get(
        `user?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}`
      );
      setDataSource(response.data.data);
      setTotalItems(response.data.pagination.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPosts();
  }, [searchQuery, currentPage]);



  const showModal = () => {
    setIsModalOpen(true);
    setSelectedUser(null);
    form.resetFields();
  };

  const handleChange = async (e) => {
    try {
      // setImgLoading(true);
      let form = new FormData();
      form.append("file", e.target.files[0]);
      await request.post("auth/upload", form);
      let res = await request.get("auth/me", form);
      setImgId(res.data.photo);
      getPosts();
    } catch (err) {
      console.log(err);
    } finally {
      // setImgLoading(false);
    }
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values) => {
    try {
      const { first_name, last_name, username, phoneNumber, birthday, address, email, description, photo } = values;
      const postData = {
        first_name,
        last_name,
        username,
        phoneNumber,
        birthday: birthday.format("YYYY-MM-DD"),
        address,
        email,
        description,
        photo: imgId,
      };

      if (selectedUser) {
        let response = await request.put(`user/${selectedUser}`, postData);
        if (response.status === 200) {
          getPosts();
          message.success("User edited successfully!");
          hideModal();
        } else {
          message.error("User update failed. Please try again.");
        }
      } else {
        const response = await request.post("user", postData);
        
        if (response.status === 201) {
          getPosts();
          message.success("User created successfully!");
          hideModal();
        } else {
          message.error("User creation failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error creating/editing user:", error);
      message.error(
        "An error occurred while creating/editing the user. Please try again."
      );
    }
  };
  
  const setFormFieldsForEditing = (data) => {
    const defaultValues = {
      first_name: "",
      last_name: "",
      username: "",
      phoneNumber: "",
      birthday: null,
      address: "",
      email: "",
      description: "",
      photo: null,
    };
  
    form.setFieldsValue({
      first_name: data.first_name || defaultValues.first_name,
      last_name: data.last_name || defaultValues.last_name,
      username: data.username || defaultValues.username,
      phoneNumber: data.phoneNumber || defaultValues.phoneNumber,
      birthday: data.birthday ? moment(data.birthday, "YYYY-MM-DD") : defaultValues.birthday,
      address: data.address || defaultValues.address,
      email: data.email || defaultValues.email,
      description: data.description || defaultValues.description,
      photo: data.photo || defaultValues.photo,
    });

    const imageUrl = data.photo ? `${IMG_URl}${data.photo}` : null;

    setImagePreviewUrl(imageUrl);
  };
  
  const clearFormFields = () => {
    form.resetFields();
    setImagePreviewUrl(null);
  };
  

  async function editUser(id) {
    try {
      let {data} = await request.get(`user/${id}`);
      setSelectedUser(id);
      setFormFieldsForEditing(data.data);
      console.log(data.data);
      showModal();
    } catch (err) {
      console.error("Error fetching user data:", err);
      message.error("An error occurred while fetching user data. Please try again.");
    }
  }
  
  async function deleteUser(id) {
    try {
      Modal.confirm({
        title: "Confirm",
        icon: <ExclamationCircleFilled />,
        content: "Are you sure you want to delete this user?",
        okText: "Delete",
        cancelText: "Cancel",
        onOk: async () => {
          await request.delete(`user/${id}`);
          message.success("User deleted successfully!");
          getPosts();
        },
        onCancel: () => {
          console.log("Deletion canceled.");
        },
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      message.error("An error occurred while deleting the user. Please try again.");
    }
  }
  

  const onSearch = (value) => {
    setSearchQuery(value);
  };
  responsiveTable();

  const { Search } = Input;
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );

  const onChangePage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="containerr">
        <div
          className="user__heading__actions"
          style={{ display: "flex", gap: "10px" }}
        >
          <Search
            placeholder="input search text"
            enterButton="Search"
            size="large"
            suffix={suffix}
            onSearch={onSearch}
            onChange={(e) => onSearch(e.target.value)}
          />
          <Button
            onClick={showModal}
            icon={<UserAddOutlined />}
            size="large"
            type="primary"
          >
            Add User
          </Button>
        </div>
        <table className="responsive-table">
          <thead className="responsive-table__head">
            <tr className="responsive-table__row">
              <th className="responsive-table__head__title responsive-table__head__title--name">
                Full Name
              </th>
              <th className="responsive-table__head__title responsive-table__head__title--status">
                UserName
              </th>
              <th className="responsive-table__head__title responsive-table__head__title--types">
                Phone Number
              </th>
              <th className="responsive-table__head__title responsive-table__head__title--update">
                Email
              </th>
              <th className="responsive-table__head__title responsive-table__head__title--country">
                Address
              </th>
              <th className="responsive-table__head__title responsive-table__head__title--actions">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="responsive-table__body">
            {loading ? (
              <p
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "34px",
                }}
              >
                <Spin size="large" />
              </p>
            ) : (
              dataSource.map((res) => (
                <tr key={res._id} className="responsive-table__row">
                  <td
                    className="responsive-table__body__text responsive-table__body__text--name"
                    style={{ display: "flex", gap: "10px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <Image
                        src={
                          res?.photo == undefined ? (
                            <Badge dot>
                              <Avatar shape="square" icon={<UserOutlined />} />
                            </Badge>
                          ) : (
                            `${IMG_URl}${res?.photo}`
                          )
                        }
                        width={60}
                        style={{ borderRadius: "8px" }}
                      />
                      <span
                        style={{ display: "flex", flexDirection: "column" }}
                      >
                        <span style={{ marginRight: "10px" }}>
                          {res.first_name}
                        </span>
                        <span style={{ color: "green" }}>{res.last_name}</span>
                      </span>
                    </div>
                  </td>
                  <td className="responsive-table__body__text responsive-table__body__text--status">
                    <span
                      className="status-indicator status-indicator--active"
                      style={{
                        color: "red",
                        fontStyle: "italic",
                        cursor: "pointer",
                      }}
                    >
                      <Typography.Text copyable>
                        {res?.username}
                      </Typography.Text>
                    </span>
                  </td>
                  <td className="responsive-table__body__text responsive-table__body__text--types">
                    {res?.phoneNumber == null ? (
                      "There is no data?"
                    ) : (
                      <Typography.Text copyable>
                        {res?.phoneNumber}
                      </Typography.Text>
                    )}
                  </td>
                  <td className="responsive-table__body__text responsive-table__body__text--update">
                    {res.email == null ? "There is no Email! 😔" : res?.email}
                  </td>
                  <td className="responsive-table__body__text responsive-table__body__text--country">
                    {res.address == null
                      ? "Address was not given"
                      : res?.address}
                  </td>
                  <td className="responsive-table__body__text responsive-table__body__text--actions">
                    <div
                      className="btn_wrappers"
                      style={{ display: "flex", gap: "15px" }}
                    >
                      <Button
                        type="primary"
                        onClick={() => deleteUser(res._id)}
                        icon={<DeleteOutlined />}
                        danger
                       
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => editUser(res._id)}
                        type="primary"
                        icon={<FormOutlined />}
                      >
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
            {dataSource.length == 0 || dataSource.length == 1 ? (
              ""
            ) : (
              <Pagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={totalItems}
                onChange={onChangePage}
              />
            )}
          </tbody>
        </table>
        <Modal
          title={selectedUser ? "Edit User" : "Add New User"}
          open={isModalOpen}
          onCancel={hideModal}
          footer={false}
        >
          <Form
            id="addPostForm"
            layout="vertical"
            autoComplete="off"
            onFinish={onFinish}
            form={form}
          >
            <Form.Item
              name="first_name"
              label="Full Name"
              rules={[
                {
                  required: true,
                  message: "Please enter a Full Name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="last_name"
              label="Last Name"
              rules={[
                {
                  required: true,
                  message: "Please enter a Last Name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="username"
              label="Username"
              rules={[
                {
                  required: true,
                  message: "Please enter a Last Name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[
                {
                  required: true,
                  message: "Please enter a Last Name!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="birthday"
              label="Birthday"
              rules={[
                {
                  required: true,
                  message: "Please enter a Last Name!",
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[
                {
                  required: true,
                  message: "Please enter a Address!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: "Please enter a Address!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Please enter a description!",
                },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="photo"
              label="Image"
              rules={[
                {
                  required: false,
                  message: "Please upload an image!",
                },
              ]}
            >
              <input type="file" onChange={handleChange} />
              {imagePreviewUrl && (
                <div className="image-preview">
                  <img
                    style={{
                      width: "150px",
                      borderRadius: "10%",
                      marginTop: "15px",
                    }}
                    src={imagePreviewUrl}
                    alt="Preview"
                  />
                </div>
              )}
            </Form.Item>
            <Button danger type="primary" onClick={hideModal}>
              Close
            </Button>
            <Button type="primary" htmlType="submit">
              {selectedUser ? "Save Post" : "Add Post"}
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UsersPage;
