import {
  Form,
  Input,
  Modal,
  Upload,
  message,
  Button,
  Spin,
  Empty,
  Card,
  Avatar,
  Skeleton,
  Pagination
} from "antd";
import {
  AudioOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  SettingOutlined,
  EllipsisOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../context/MainContext";
import { IMG_URl, LIMIT } from "../../const";
import { request } from "../../server/request";

// style
import "../../pages/user/myPost//ownposts.scss";
import usePostNavigate from "../../hooks/usePostNavigate";
const { Meta } = Card;

const PostsPage = () => {
  const {
    setSearch,
    categories,
    search,
    page,
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
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [imgStatus, setImgStatus] = useState(null);
  const itemsPerPage = 8;
  //using hook
  const getPostId = usePostNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const hideModal = () => {
    setIsModalOpen(false);
  };
 console.log(imgStatus);
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
        `post/?page=${currentPage}&limit=${itemsPerPage}&search=${search}`
      );
      setMyPosts(data?.data);
      setTotalItems(data.pagination.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getPosts();
  }, [search, page, totalItems, setMyPosts]);

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
      
      res.status === 404 ? setImgStatus(404) : setImgStatus(imageUrl) 
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
          await request.delete(`post/${id}`);
          message.success("Post deleted successfully!");
          getPosts();
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

  const onChange = (page) => {
    setCurrentPage(page);
    getPosts()
  };

  return (
    <section className="own_posts">
      <div className="container">
        <div className="header__wrapper" style={{ marginTop: "-100px" }}>
          <h1>All posts</h1>
          <Button type="primary" text="Add Post" onClick={openModal}>
            Add Post
          </Button>
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
          <div className={`ownPosts__Card__Wrapper admin_post `}>
            
            {myPosts.length == 0 ? (
              <Empty />
            ) : (
              myPosts.map((res) => (
                <Card
                  key={res._id}
                  style={{
                    width: 300,
                    height: "450px"
                  }}
                  cover={
                    <img
                      width='100%'
                      height={150}
                      alt="There is 404 error!"
                      src={`${IMG_URl + res?.photo?._id}.${
                        res?.photo?.name.split(".")[1]
                      }`}
                    />
                  }
                  actions={[
                    <DeleteOutlined
                      key="setting"
                      onClick={() => deletePost(res._id)}
                    />,
                    <EditOutlined
                      key="edit"
                      onClick={() => editPost(res._id)}
                    />,
                    <EllipsisOutlined key="ellipsis" />,
                  ]}
                >
                  <Skeleton loading={loading} active>
                    <Meta
                      avatar={<Avatar src={IMG_URl + res?.user?.photo} />}
                      title={res?.title}
                      description={res?.description}
                    />
                  </Skeleton>
                  <p
                    style={{
                      color: "green",
                      paddingTop: "10px",
                      fontWeight: "bold",
                    }}
                  >
                    {res?.category?.name}
                  </p>
                  <p
                    style={{
                      display: "flex",
                      gap: "5px",
                      color: "blue",
                      paddingTop: "2px",
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}
                  >
                    <span style={{ color: "#000", marginLeft: "5px" }}>
                      Author:
                    </span>
                    {res?.user?.first_name}
                  </p>
                </Card>
              ))
            )}
          </div>
            {myPosts.length == 0 ? (
              ""
            ) : (
              <Pagination
                current={currentPage}
                pageSize={itemsPerPage}
                total={totalItems}
                onChange={onChange}
              />
            )}
        </div>
      </div>
    </section>
  );
};

export default PostsPage;
