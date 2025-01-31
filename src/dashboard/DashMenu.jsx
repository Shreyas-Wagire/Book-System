import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import userImg from "../assets/profile.jpg";
import { Sidebar } from 'flowbite-react';
import { BiBuoy } from 'react-icons/bi';
import {
    HiArrowSmRight,
    HiChartPie,
    HiInbox,
    HiOutlineCloudUpload,
    HiShoppingBag,
    HiSupport,
    HiTable,
    HiUser,
    HiViewBoards,
} from 'react-icons/hi';
import { AuthContext } from '../contects/AuthProvider';

export const DashMenu = () => {
    const {user} = useContext(AuthContext)
    
    console.log(user)
    return (

        <Sidebar aria-label="Sidebar with content separator example">
            <Sidebar.Logo href="/" img={user?.photoURL} className='w-16 h-16 rounded' imgAlt="Flowbite logo">
                {
                    user?.displayName || "DEMO user"
                }
            </Sidebar.Logo>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Sidebar.Item to="/dashboard" href="/admin/dashboard" icon={HiChartPie}>
                        Dashboard
                    </Sidebar.Item>
                    <Sidebar.Item to="/uploadbook" href="/admin/dashboard/upload" icon={HiOutlineCloudUpload}>
                        Upload Books
                    </Sidebar.Item>
                    <Sidebar.Item to="/inbox" href="/admin/dashboard/manage" icon={HiInbox}>
                        Manage Book
                    </Sidebar.Item>
                    <Sidebar.Item to="/users" icon={HiUser}>
                        Users
                    </Sidebar.Item>
                    <Sidebar.Item to="/products" icon={HiShoppingBag}>
                        Products
                    </Sidebar.Item>
                    <Sidebar.Item to="/signin" href="/login" icon={HiArrowSmRight}>
                        Sign In
                    </Sidebar.Item>
                    <Sidebar.Item to="/signup" href="/logout" icon={HiTable}>
                       Log Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
                <Sidebar.ItemGroup>
                    <Sidebar.Item to="/upgrade" icon={HiChartPie}>
                        Upgrade to Pro
                    </Sidebar.Item>
                    <Sidebar.Item to="/documentation" icon={HiViewBoards}>
                        Documentation
                    </Sidebar.Item>
                    <Sidebar.Item to="/help" icon={HiSupport}>
                        Help
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default DashMenu;
