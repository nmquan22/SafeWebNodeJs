import React, { useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext.js";

const Logout = () => {
    const navigate = useNavigate();
    const { setUsername } = useAuth();

    useEffect(() => {
        // Xử lý đăng xuất
        localStorage.removeItem("username"); // Xóa token trong localStorage hoặc cookies
        setUsername(""); // Xóa token trong context
        navigate("/login"); // Chuyển hướng về trang đăng nhập
    }, [navigate]);

    return <p>Đang đăng xuất...</p>; // Có thể hiển thị loading hoặc thông báo
};

export default Logout;
