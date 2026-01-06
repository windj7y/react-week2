import { useState } from 'react'
import axios from 'axios'

const url = 'https://ec-course-api.hexschool.io/v2';
const apiPath = 'wind-api';

function App() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState(null);
  const [msg, setMsg] = useState('');

  async function login(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/admin/signin`, formData);
      const { expired, token } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      axios.defaults.headers.common['Authorization'] = token;
      setIsAuth(true);
      getProducts();
    } catch (error) {
      alert(error.response.data.message);
    }
  }

  async function getProducts() {
    try {
      const res = await axios.get(`${url}/api/${apiPath}/admin/products`);
      setProducts(res.data.products);
    } catch (error) {
      console.log(`取得產品失敗：${error.response.data.message}`);
    }
  }

  async function checkLogin() {
    try {
      const res = await axios.post(`${url}/api/user/check`);
      setMsg('已登入');
    } catch (error) {
      setMsg('未登入');
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  return (
    <>
      {isAuth ? (
        <div className="container">
          <div className="row mt-5">
            <div className="col-md-6">
              <button
                className="btn btn-danger mb-5"
                type="button"
                id="check"
                onClick={checkLogin}
              >
                確認是否登入{ msg ? ` (${msg})` : '' }
              </button>
              <h2>產品列表</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>查看細節</th>
                  </tr>
                </thead>
                <tbody>
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.title}</td>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td>{product.is_enabled ? "啟用" : "未啟用"}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => setTempProduct(product)}
                          >
                            查看細節
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">尚無產品資料</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-md-6">
              <h2>單一產品細節</h2>
              {tempProduct ? (
                <div className="card mb-3">
                  <img
                    src={tempProduct.imageUrl}
                    className="card-img-top primary-image"
                    alt="主圖"
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge bg-primary ms-2">
                        {tempProduct.category}
                      </span>
                    </h5>
                    <p className="card-text">
                      商品描述：{tempProduct.description}
                    </p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <div className="d-flex">
                      <p className="card-text text-secondary">
                        <del>{tempProduct.origin_price}</del>
                      </p>
                      元 / {tempProduct.price} 元
                    </div>
                    <h5 className="mt-3">更多圖片：</h5>
                    <div className="d-flex flex-wrap">
                      {tempProduct.imagesUrl?.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          className="images"
                          alt="副圖"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-secondary">請選擇一個商品查看</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={login}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    name="username"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2026~∞ - 六角學院</p>
        </div>
      )}
    </>
  )
}

export default App
