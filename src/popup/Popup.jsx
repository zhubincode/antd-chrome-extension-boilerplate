import React, { useState, useEffect } from "react";
import copy from "copy-to-clipboard";
import "./Popup.scss";
import { message } from "antd";
import { getToken } from "./otp.js";

const Popup = () => {
  const [time, setTime] = useState(getRemainingTime());

  // 获取剩余有效时间
  function getRemainingTime() {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timestampRemainder = currentTimestamp % 30;
    return 30 - timestampRemainder;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = getRemainingTime();
      setTime(newTime);
      if (newTime === 0) {
        refresh();
      }
    }, 1000);

    return () => {
      clearInterval(timer); // 清除定时器以避免内存泄漏
    };
  }, []);

  const handleCopy = (str = "") => {
    copy(str);
    message.success("口令已复制到剪切板");
  };

  const getCode = (code) => {
    return getToken(code, { timestamp: Date.now() });
  };

  const secretKeyArr = [
    {
      name: "admin",
      tag: "xm",
      key: "KYFB3ELA5ZNW37EITCNFHO5YNID7GV5B",
    },
    {
      name: "admin12",
      tag: "xma",
      key: "SDZLP5GIDOHHIJ6PFJQ2UT56U7PINFXY",
    },
  ];

  return (
    <div className={`${WRAPPER_CLASS_NAME}`}>
      <div className="token">令牌 {time}</div>
      <div className="basic-card">
        {secretKeyArr.map((item, index) => (
          <div key={index} className="card">
            <div className="title">{item.name}</div>
            <div
              className="code"
              key={time}
              onClick={() => handleCopy(item.key)}
            >
              {getCode(item.key)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Popup;
