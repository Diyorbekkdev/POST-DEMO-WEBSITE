import {
  Avatar,
  Card,
  Skeleton,
  Button,
  Input,
  Modal,
  Form,
  Pagination,
  message,
  Spin,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  AudioOutlined,
  UserAddOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
const { Meta } = Card;

import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { MainContext } from "../../context/MainContext";
import { IMG_URl, LIMIT } from "../../const";
import { request } from "../../server/request";
import TextArea from "antd/es/input/TextArea";
import './usersPage/users.scss';
const CategoriesPage = () => {
  const { setUploadedImage, uploadedImage, setTotal, total, setMyPosts } =
    useContext(MainContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const hideModal = () => {
    setIsModalOpen(false);
  };

  const onSearch = (e) => {
    setSearch(e);
  };
  // get categories
  const getCategories = async () => {
    try {
      setLoading(true);
      console.log(loading);
      let { data } = await request.get(
        `category?page=${page}&limit=${LIMIT}&search=${search}`
      );
      setCategories(data?.data);
      setTotal(data.pagination.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCategories();
  }, [search, page]);

  const { Search } = Input;

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );

  const onFinish = async (values) => {
    try {
      const { name, description, photo } = values;
      const postData = {
        name,
        description,
        photo: uploadedImage,
      };

      if (selected) {
        let response = await request.put(`category/${selected}`, postData);
        if (response.status === 200) {
          getCategories();
          message.success("Category edited successfully!");
          hideModal();
        } else {
          message.error("Post creation failed. Please try again.");
        }
      } else {
        const response = await request.post("category", postData);

        getCategories();
        if (response.status === 201) {
          message.success("Post created successfully!");
          hideModal();
        } else {
          message.error("Post creation failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error creating post:", error);
      message.error(
        "An error occurred while creating the post. Please try again."
      );
    }
  };

  const handleChange = (page) => {
    console.log(page);
  };
  const openModal = () => {
    setIsModalOpen(true);
    clearFormFields();
  };

  const setFormFieldsForEditing = (data) => {
    form.setFieldsValue({
      name: data.name,
      description: data.description,
      uploadedImage: data?.photo?._id,
    });
    const imageUrl = `${IMG_URl + data?.photo?._id}.${
      data?.photo?.name.split(".")[1]
    }`;
    setImagePreviewUrl(imageUrl);
  };

  const clearFormFields = () => {
    form.resetFields();
    setImagePreviewUrl(null);
    setUploadedPhoto(null);
  };

  async function editPost(id) {
    try {
      let { data } = await request.get(`category/${id}`);
      setEditFormData(data);
      setSelected(id);
      setFormFieldsForEditing(data);
      showModal();
    } catch (err) {
      console.error("Error fetching post data:", err);
      message.error(
        "An error occurred while fetching post data. Please try again."
      );
    }
  }
  async function deleteCategory(id) {
    try {
      Modal.confirm({
        title: "Confirm",
        icon: <ExclamationCircleFilled />,
        content: "Are you sure you want to delete this post?",
        okText: "Delete",
        cancelText: "Cancel",
        onOk: async () => {
          await request.delete(`category/${id}`);
          message.success("Post deleted successfully!");
          getCategories();
        },
        onCancel: () => {
          console.log("Deletion canceled.");
        },
      });
    } catch (err) {
      console.error("Error deleting post:", err);
      message.error(
        "An error occurred while deleting the post. Please try again."
      );
    }
  }
  //imgupload
  const handleImageUpload = async (e) => {
    try {
      const form = new FormData();
      form.append("file", e.target.files[0]);
      let res = await request.post("upload", form);
      setUploadedImage(res?.data?._id);
      console.log(res?.data);
      const imageUrl = `${IMG_URl + res?.data?._id}.${
        res?.data?.name.split(".")[1]
      }`;
      setImagePreviewUrl(imageUrl);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section>
      <div
        className="searching_box"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "15px",
        }}
      >
        <Search
          placeholder="input search text"
          enterButton="Search"
          size="large"
          suffix={suffix}
          // onSearch={onSearch}
          onChange={(e) => onSearch(e.target.value)}
        />
        <Button
          onClick={openModal}
          icon={<UserAddOutlined />}
          size="large"
          type="primary"
        >
          Add Category
        </Button>
      </div>
      <div
        id="category_card_row"
        style={{
          display: `${loading ? "block" : "grid"}`,
          gridTemplateColumns: "repeat(3, 1fr)",
          placeItems: "center",
        }}
      >
        {loading ? (
          <div
            style={{
              width: "100%",
              textAlign: "center",
              height: "600px",
              margin: "100px auto",
            }}
          >
            <Spin size="large" style={{ textAlign: "center" }} />
          </div>
        ) : (
          categories.map((res) => (
            <Card
              key={res?._id}
              style={{
                width: 300,
                marginTop: 16,
              }}
              actions={[
                <DeleteOutlined
                  key="setting"
                  onClick={() => deleteCategory(res?._id)}
                />,
                <EditOutlined key="edit" onClick={() => editPost(res?._id)} />,
                <EllipsisOutlined key="ellipsis" />,
              ]}
            >
              <Skeleton loading={loading} avatar active>
                <Meta
                  avatar={
                    <Avatar
                      src={`${IMG_URl + res?.photo?._id}.${
                        res?.photo?.name.split(".")[1]
                      }`}
                    />
                  }
                  title={res?.name}
                  description={res?.description}
                />
              </Skeleton>
            </Card>
          ))
        )}
        
        <div className="modal">
          <Modal
            title={selected ? "Editing Category" : "Add New Category"}
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
                name="name"
                label="Category name"
                rules={[
                  {
                    required: true,
                    message: "Please fill this field !",
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
                    message: "Please fill this field !",
                  },
                ]}
              >
                <TextArea />
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
                <input type="file" onChange={handleImageUpload} />
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
              <div style={{ display: "flex", gap: "10px" }}>
                <Button danger type="primary" onClick={hideModal}>
                  Close
                </Button>
                <Button type="primary" htmlType="submit">
                  {selected ? "Save category" : "Add Category"}
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
        {categories.length == 0 || categories.length == 1 ? (
          ""
        ) : (
          <Pagination
            style={{textAlign: 'center', marginTop: '25px'}}
            current={page}
            pageSize={LIMIT}
            total={total}
            onChange={handleChange}
          />
        )}
      </div>
    </section>
  );
};

export default CategoriesPage;
