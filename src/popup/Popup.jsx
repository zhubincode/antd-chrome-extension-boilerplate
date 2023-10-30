import React, { Component } from "react";
import copy from "copy-to-clipboard";
import "./Popup.scss";
import { go } from "../chrome";
import { message } from "antd";
export default class Popup extends Component {
  state = {
    name: WRAPPER_CLASS_NAME,
  };

  gotoPage() {
    go("../html/view.html");
  }

  handleCopy = (str = "") => {
    copy(str);
    message.success("口令已复制到剪切板");
  };
  secretKeyArr = [
    {
      name: "admin",
      tag: "xm",
      key: "1231asdasdasdasdsaasas",
    },
    {
      name: "admin12",
      tag: "xma",
      key: "1231asdasdasdasdsaasas",
    },
  ];

  render() {
    return (
      <div className={`${WRAPPER_CLASS_NAME}`}>
        <div className="token">令牌</div>
        <div className="basic-card">
          {this.secretKeyArr.map((item, index) => (
            <div key={index} className="card">
              <div className="title">{item.name}</div>
              <div className="code" onClick={() => this.handleCopy(item.key)}>
                112345
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
