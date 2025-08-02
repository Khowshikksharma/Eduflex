import React from "react";
import { useNavigate } from "react-router-dom";
import bgGif from "../assets/bg.gif";

const Animated404 = ({ authState }) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    if (authState?.isAdminLoggedIn) {
      navigate("/admin/home/dashboard");
    } else if (authState?.isFacultyLoggedIn) {
      navigate("/faculty/home/dashboard");
    } else if (authState?.isStudentLoggedIn) {
      navigate("/student/home/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <section
      style={{
        padding: "40px 0",
        background: "#fff",
        fontFamily: '"Arvo", serif',
        overflow: "hidden",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <div className="row" style={{ display: "flex", justifyContent: "center" }}>
          <div className="col-sm-12">
            <div
              className="col-sm-10 col-sm-offset-1 text-center"
              style={{ textAlign: "center", margin: "0 auto", maxWidth: "800px" }}
            >
              <div
                className="four_zero_four_bg"
                style={{
                  backgroundImage: `url(${bgGif})`,
                  height: "100px",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <h1 style={{ fontSize: "80px", color: "#fff", textShadow: "2px 2px #000" }}>
                  404
                </h1>
              </div>
              <div className="contant_box_404" style={{ marginTop: "-50px" }}>
                {/* <h3 className="h2" style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "10px" }}>
                  Looks like you're lost
                </h3> */}
                <p style={{ color: "#666", marginBottom: "20px" }}>
                  The page you are looking for is not available!
                </p>
                <button
                  onClick={handleGoHome}
                  style={{
                    color: "#fff",
                    padding: "10px 20px",
                    background: "#39ac31",
                    margin: "20px 0",
                    display: "inline-block",
                    textDecoration: "none",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Go to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Animated404;
