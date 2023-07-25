import { Fragment, useCallback, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Tabs,
  Upload,
  message,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { request } from "../../../server/request";
import { useEffect } from "react";
import { setAuthCookies } from "../../../server/request";

import "./useraccount.scss";
import { IMG_URl, TOKEN } from "../../../const";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
const { useForm } = Form;
const { TextArea } = Input;

const AccountPage = () => {
  let items = [
    {
      label: "Personal Information",
      key: "info",
      children: <Information />,
    },
    {
      label: "Password managing",
      key: "pass",
      children: <Password />,
    },
  ];
  return (
    <Fragment>
      <div className="container main_layout">
        <Tabs defaultActiveKey="info" centered items={items} />
      </div>
    </Fragment>
  );
};

const Information = () => {
  const navigate = useNavigate()
  const [form] = useForm();
  const [imgLoading, setImgLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [callback, setCallback] = useState(false);
  const [imgId, setImgId] = useState(null);

  const getUserData = useCallback(() => {
    request("auth/me").then(({ data }) => {
      form.setFieldsValue(data);
      setImageUrl(data.photo);
    });
  }, [form]);

  useEffect(() => {
    getUserData();
  }, [callback, getUserData]);

  const handleChange = async (e) => {
    try {
      setImgLoading(true);
      let form = new FormData();
      form.append("file", e.file.originFileObj);
      await request.post("auth/upload", form);
      let res = await request.post("upload", form);
      setImgId(res.data);
      setCallback(!callback);
      getUserData();
    } catch (err) {
      console.log(err);
    } finally {
      setImgLoading(false);
    }
  };

  const submit = async (values) => {
    console.log(values);
    try {
      setLoading(true);
      await request.put("auth/details", values);
      message.success("Edited successfully !");
      getUserData();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove(TOKEN)
    navigate('/')
  };
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={6}>
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          // beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <img
              src={`${IMG_URl + imgId?._id}.${imgId?.name.split(".")[1]}`}
              alt="avatar"
              style={{
                width: "100%",
              }}
            />
          ) : (
            <div>
              {imgLoading ? <LoadingOutlined /> : <PlusOutlined />}
              <div
                style={{
                  marginTop: 8,
                }}
              >
                Upload
              </div>
            </div>
          )}
        </Upload>
      </Col>
      <Col xs={24} lg={18}>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={submit}
        >
          <Form.Item
            name="first_name"
            label="First name"
            rules={[
              {
                required: true,
                message: "Please fill this field !",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="last_name"
            label="Last name"
            rules={[
              {
                required: true,
                message: "Please fill this field !",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: "Please fill this field !",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="info"
            label="Info"
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
            name="phoneNumber"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: "Please fill this field !",
              },
              {
                pattern: "",
                message: "+998999400807",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[
              {
                required: true,
                message: "Please fill this field!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} htmlType="submit" type="primary">
              Save Changes
            </Button>
            <Button type="primary" danger onClick={handleLogout}>
              Logout
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

const Password = () => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const submit = async (values) => {
    console.log(values);
    try {
      setLoading(true);
      let { data } = await request.put("auth/updatepassword", values);
      setAuthCookies(data);
      message.success("Changed successfully !");
      form.resetFields();
    } catch (err) {
      message.error(err.response.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form form={form} layout="vertical" autoComplete="off" onFinish={submit}>
      <Form.Item
        name="currentPassword"
        label="Current Password"
        rules={[
          {
            required: true,
            message: "Please fill this field !",
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>
      <Form.Item
        name="newPassword"
        label="New password"
        rules={[
          {
            required: true,
            message: "Please fill this field !",
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>
      <Form.Item>
        <Button loading={loading} htmlType="submit" type="primary">
          Change password
        </Button>
      </Form.Item>
    </Form>
  );
};
export default AccountPage;
