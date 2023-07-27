import React, { useState } from "react";
import {
  PieChartOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  SnippetsOutlined,
  CalendarOutlined,
  FileSyncOutlined
  
} from "@ant-design/icons";
import { Avatar, Breadcrumb, Layout, Menu, theme } from "antd";
const { Header, Content, Footer, Sider } = Layout;

import logo from "../../assets/images/news (1).png";
import Search from "antd/es/input/Search";
import AllPosts from "../../pages/admin/AllPosts";
import CategoriesPage from "../../pages/admin/CategoriesPage";
import DashboardPage from "../../pages/admin/DashboardPage";
import Account from "../../pages/admin/Account";
import UsersPage from "../../pages/admin/usersPage/UsersPage";
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Dashboard", "1", <PieChartOutlined size={50} />),
  getItem("Account", "2", <UserOutlined />),
  getItem("Users", "3", <UsergroupAddOutlined />),
  getItem("Category", "4", <SnippetsOutlined />),
  getItem("Posts", "5", <CalendarOutlined />),
  getItem("Comments", "6", <FileSyncOutlined />),
];
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState("1");
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          className="demo-logo-vertical"
          style={{
            display: "flex",
            justifyContent: "start",
            gap: "5px",
            alignItems: "center",
            background: "orange",
            marginBottom: "10px",
          }}
        ></div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["2"]}
          mode="inline"
          items={items}
          selectedKeys={[selectedKey]}
          onClick={(e) => setSelectedKey(e.key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            paddingInline: "0 25px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <img style={{ width: "60px" }} src={logo} alt="logo" />
            <h1
              style={{
                color: "blue",
                fontSize: "25px",
                fontWeight: "bold",
                fontFamily: "Sen",
                marginTop: "15px",
              }}
            >
              Nes Wave
            </h1>
          </div>
          <div
            className="admin_right"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "25px",
            }}
          >
            <Search placeholder="input search text" enterButton />
            <Avatar size={45} icon={<UserOutlined />}  />
          </div>
        </Header>
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Account</Breadcrumb.Item>
          </Breadcrumb>

          <div
            style={{
              padding: 24,
              minHeight: 550,
              background: colorBgContainer,
            }}
          >
            {selectedKey === "1" && <DashboardPage />}
            {selectedKey === "2" && <Account />}
            {selectedKey === "3" && <UsersPage/>}
            {selectedKey === "4" && <CategoriesPage />}
            {selectedKey === "5" && <CategoriesPage />}
            {selectedKey === "6" && <CategoriesPage />}
            
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Nes Wave @2023 all rights reserved
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;
