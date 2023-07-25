import {
  Form,
  Input,
  Modal,
  Upload,
  message,
  Button,
  Pagination,
  Spin,
  Empty,
} from "antd";
import {
  AudioOutlined,
  FundViewOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { MainContext } from "../../../context/MainContext";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../../server/request";
import { IMG_URl, LIMIT } from "../../../const";


import CustomButton from "../../../components/Button/Button";
import usePostNavigate from "../../../hooks/usePostNavigate";
// style
import "./ownposts.scss";

const MyPostsPage = () => {
  const {
    setSearch,
    categories,
    search,
    page,
    total,
    setTotal,
    uploadedImage,
    setUploadedImage,
  } = useContext(MainContext);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { Search } = Input;
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tags, setTags] = useState("");
  const [myPosts, setMyPosts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  //using hook
  const getPostId = usePostNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const hideModal = () => {
    setIsModalOpen(false);
  };

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );

  // get posts
  const getPosts = async () => {
    try {
      setLoading(true);
      let { data } = await request.get(
        `post/user?page=${page}&limit=${LIMIT}&search=${search}`
      );
      setMyPosts(data?.data);
      setTotal(data.pagination.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getPosts();
  }, [search, page, setTotal, setMyPosts]);

  //imgupload
  const handleImageUpload = async (e) => {
    try {
      const form = new FormData();
      form.append("file", e.target.files[0]);
      let res = await request.post("upload", form);
      setUploadedImage(res?.data?._id);

      const imageUrl = `${IMG_URl + res?.data?._id}.${
        res?.data?.name.split(".")[1]
      }`;
      setImagePreviewUrl(imageUrl);
    } catch (err) {
      console.log(err);
    }
  };

  //submit
  const onFinish = async (values) => {
    try {
      const { title, description, tags, category, photo } = values;
      const tagsArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];
      const postData = {
        title,
        description,
        tags: tagsArray,
        category,
        photo: uploadedImage,
      };

      if (selected) {
        let response = await request.put(`post/${selected}`, postData);
        if (response.status === 200) {
          getPosts();
          message.success("Post edited successfully!");
          hideModal();
        } else {
          message.error("Post creation failed. Please try again.");
        }
        console.log("succes");
      } else {
        const response = await request.post("post", postData);

        getPosts();
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

  const setFormFieldsForEditing = (data) => {
    form.setFieldsValue({
      title: data.title,
      category: data.category._id,
      tags: data.tags.join(","),
      description: data.description,
      uploadedImage: data.photo._id,
    });
    const imageUrl = `${IMG_URl + data.photo._id}.${
      data.photo.name.split(".")[1]
    }`;
    setImagePreviewUrl(imageUrl);
  };

  const clearFormFields = () => {
    form.resetFields();
    setImagePreviewUrl(null);
    setUploadedPhoto(null);
  };
  const openModal = () => {
    setIsModalOpen(true);
    clearFormFields();
  };
  
  async function editPost(id) {
    try {
      let { data } = await request.get(`post/${id}`);
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

  async function deletePost(id) {
    try {
      Modal.confirm({
        title: "Confirm",
        icon: <ExclamationCircleFilled />,
        content: "Are you sure you want to delete this post?",
        okText: "Delete",
        cancelText: "Cancel",
        onOk: async () => {
          // User confirmed, proceed with the deletion
          await request.delete(`post/${id}`);
          message.success("Post deleted successfully!");
          getPosts();
        },
        onCancel: () => {
          // User canceled the deletion
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

  const onChange = (page) => {
    setPage(page);
  };
  return (
    <section className="own_posts">
      <div className="container">
        <div className="header__wrapper">
          <h1>My posts</h1>
          <CustomButton text="Add Post" onClick={openModal} />
        </div>
        <div className="line"></div>
        <div className="searching">
          <Search
            placeholder="input search text"
            enterButton="Search"
            size="large"
            suffix={suffix}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="modal_wrapper">
          <Modal
            title={selected ? "Editing Post" : "Add New Post"}
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
                name="title"
                label="Title"
                rules={[
                  {
                    required: true,
                    message: "Please enter a title!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="category"
                label="Category"
                rules={[
                  {
                    required: true,
                    message: "Please select a category!",
                  },
                ]}
              >
                <select placeholder="Select a category">
                  {categories?.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </Form.Item>
              <Form.Item
                name="tags"
                label="Tags"
                rules={[
                  {
                    required: true,
                    message: "Please enter at least one tag!",
                  },
                ]}
              >
                <Input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags (comma-separated)"
                />
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
              <Button danger type="primary" onClick={hideModal}>
                Close
              </Button>
              <Button type="primary" htmlType="submit">
                {selected ? "Save Post" : "Add Post"}
              </Button>
            </Form>
          </Modal>
        </div>
        <div className="ownPosts__row">
          <div className="ownPosts__Card__Wrapper">
            {loading ? (
              <div className="example">
                <Spin size="large" />
              </div>
            ) : null}
            {myPosts.length == 0 ? <Empty/> : myPosts.map((res) => (
              <div key={res._id} className="card">
                <div className="postimg_container">
                  {res?.photo?._id ? (
                    <div
                      style={{
                        width: "100%",
                        height: "450px",
                        background: `url("${IMG_URl + res?.photo?._id}.${
                          res?.photo?.name.split(".")[1]
                        }") center center, no-repeat`,
                        backgroundSize: "cover",
                        borderRadius: "12px",
                      }}
                      className="img"
                    />
                  ) : (
                    "No img herer"
                  )}
                </div>
                <div className="card_information">
                  <div className="ownPost_info">
                    <p className="name">{res?.category?.name}</p>
                    <h2 className="title">{res?.title}</h2>
                    <p>{res?.description}</p>
                  </div>
                  <div className="own_post_buttons">
                    <Button
                      type="primary"
                      size="large"
                      icon={<FundViewOutlined />}
                      onClick={() => getPostId(res._id)}
                    >
                      See Post
                    </Button>
                    <Button
                      onClick={() => editPost(res._id)}
                      type="primary"
                      size="large"
                      icon={<EditOutlined />}
                    >
                      Edit Post
                    </Button>
                    <Button
                      type="primary"
                      size="large"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => deletePost(res._id)}
                    >
                      Delete Post
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {loading ? null : myPosts.length !== 0 ? (
              <div className="pagination_wrpper">
                <Pagination current={page} onChange={onChange} total={total} />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyPostsPage;
