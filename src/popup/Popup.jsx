import React, { useState, useEffect } from "react";
import copy from "copy-to-clipboard";
import "./Popup.scss";
import { message, Progress } from "antd";
import { getToken } from "./otp.js";
import { useRequest } from "ahooks";

import request from "../utils/request.js";

export const getSystemInfo = (params) => {
  return request("/mfa/list", {
    params: params, // 确保这里正确地传递了params参数
  });
};

const Popup = () => {
  const [time, setTime] = useState(getRemainingTime());
  const { data, run } = useRequest(getSystemInfo, {
    defaultParams: [{ page: 1, pageSize: 100 }],
  });
  const { results = [] } = data?.data?.data || {};
  console.log(data);
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
    }, 1000);

    return () => {
      clearInterval(timer); // 清除定时器以避免内存泄漏
    };
  }, []);

  const handleCopy = (str = "") => {
    run({ page: 1, pageSize: 100 });
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
        {results.map((item, index) => (
          <div key={index} className="card">
            <div className="title">{item.account}</div>
            <div
              className="code"
              key={time}
              onClick={() => handleCopy(getCode(item.secret_key))}
            >
              {getCode(item.secret_key)}
            </div>
            <Progress
              strokeColor={{
                from: "#108ee9",
                to: "#87d068",
              }}
              className="progress"
              strokeLinecap="butt"
              percent={(time / 30) * 100}
              status="active"
              showInfo={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Popup;
