import { Avatar, Card, Skeleton, Button, Input, Modal, Form, Pagination } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
  AudioOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
const { Meta } = Card;
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { MainContext } from "../../context/MainContext";
import { IMG_URl, LIMIT } from "../../const";
import { request } from "../../server/request";
// import { Form } from "react-router-dom";

const CategoriesPage = () => {
  const { categories, myPosts, setTotal, total, setMyPosts } = useContext(MainContext);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  
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
 
 
  // get categories
  const getCategories = async () => {
    try {
      setLoading(true);
      let { data } = await request.get(
        `category?page=${page}&limit=${LIMIT}&search=${search}`
      );
      setMyPosts(data?.data);
      setTotal(data.pagination.total);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCategories();
  }, [search, page, setTotal, setMyPosts]);

  const { Search } = Input;

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );
  const handleChange = (page) => {
      console.log(page);
  }

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
          // onChange={(e) => onSearch(e.target.value)}
        />
        <Button
          onClick={showModal}
          icon={<UserAddOutlined />}
          size="large"
          type="primary"
        >
          Add Category
        </Button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          placeItems: "center",
        }}
      >
        {categories.map((res) => (
          <Card
            style={{
              width: 300,
              marginTop: 16,
            }}
            actions={[
              <DeleteOutlined key="setting" />,
              <EditOutlined key="edit" />,
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
        ))}
        <Pagination
          current={page}
          pageSize={LIMIT}
          total={total}
          onChange={handleChange}
        />
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
              // onFinish={onFinish}
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
      </div>
    </section>
  );
};

export default CategoriesPage;
