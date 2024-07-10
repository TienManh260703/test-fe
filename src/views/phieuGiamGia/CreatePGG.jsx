import {
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Row,
  Table,
  Button,
  notification,
} from 'antd'
import { useEffect, useState } from 'react'
import { getPageKH } from '../../service/khachHangService'
import moment from 'moment'
import { createPGG, getPGGById, updatedPGG } from '../../service/phieuGiamGiaService'
import { useNavigate, useParams } from 'react-router-dom'

function CreatePGG() {
  const navigate = useNavigate()

  const { id } = useParams()
  const [form] = Form.useForm()
  console.log(id)

  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(false)
  const [customerCoupons, setCustomerCoupons] = useState([])
  const [showCustomerTable, setShowCustomerTable] = useState(false)

  const columns = [
    {
      title: 'Họ và tên',
      key: 'fullName',
      render: (_, record) => {
        return `${record.ho ? record.ho : ''} ${record.ten ? record.ten : ''}`.trim() || 'N/A'
      },
    },
    {
      title: 'SDT',
      dataIndex: 'sdt',
      key: 'sdt',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (text ? text : 'N/A'),
    },
  ]

  /// tích chọn kh
  const onSelectChange = (customerSelect) => {
    console.log('customerSelect ', customerSelect)
    setCustomerCoupons(customerSelect)
  }

  const rowSelection = {
    customerCoupons,
    onChange: onSelectChange,
  }
  ///

  const handleSubmit = async (values) => {
    console.log(values)
    const data = {
      ...values,
      listKhachHang: customerCoupons,
      ngayBatDau: values.ngayBatDauForm ? values.ngayBatDauForm.format('YYYY-MM-DD') : undefined,
      ngayHetHan: values.ngayKetThucForm ? values.ngayKetThucForm.format('YYYY-MM-DD') : undefined,
    }
    delete data.ngayKetThucForm
    delete data.ngayBatDauForm

    try {
      let response
      if (id) {
        response = await updatedPGG(id, data)
      } else {
        response = await createPGG(data)
      }

      console.log('PGG response : ', response)

      if (response.status_code == 200 || response.status_code == 201) {
        form.resetFields()
        notification.success({
          message: 'Oke',
          description: `Thông tin: ${id ? 'Cập nhật' : 'Thêm mới'} thành công`,
          showProgress: true,
          duration: 2,
        })
        if (id) {
          navigate(`/coupons/list`)
        }
      } else {
        notification.error({
          message: 'Lỗi',
          description: `Thông tin: ${id ? 'Cập nhật' : 'Thêm mới'} thất bại`,
          showProgress: true,
          duration: 2,
        })
      }
    } catch (error) {
      console.error('Error submitting PGG:', error)
      notification.error({
        message: 'Lỗi',
        description: `Thông tin: ${id ? 'Cập nhật' : 'Thêm mới'} thất bại`,
        showProgress: true,
        duration: 2,
      })
    }
  }
  useEffect(() => {
    if (id) {
      fetchPGGData(id)
    }
  }, [id])
  const handlePhamViApDungChange = (value) => {
    if (value === 2) {
      setShowCustomerTable(true)
    } else {
      setShowCustomerTable(false)
    }
  }
  const fetchPGGData = async (id) => {
    try {
      const response = await getPGGById(id)
      if (response.status_code == 200 && response.data) {
        form.setFieldsValue({
          ma: response.data.ma,
          ten: response.data.ten,
          loaiGiamGia: response.data.loaiGiamGia,
          phamViApDung: response.data.phamViApDung,
          giaTriGiamGia: response.data.giaTriGiamGia,
          giaTriDonToiThieu: response.data.giaTriDonToiThieu,
          giamToiGia: response.data.giamToiGia,
          ngayBatDauForm: moment(response.data.ngayBatDau),
          ngayKetThucForm: moment(response.data.ngayHetHan),
          moTa: response.data.moTa,
        })
        handlePhamViApDungChange(response.data.phamViApDung)
      } else {
        notification.error({
          message: 'Lỗi',
          description: 'Api get PGG By Id Lỗi || Data =null',
        })
      }
    } catch (error) {
      console.error('Error fetching PGG:', error)
      notification.error({
        message: 'Lỗi',
        description: 'Api get PGG By Id Lỗi',
      })
    }
  }

  const fetchApiAllCustomer = async () => {
    setLoading(true)
    try {
      const response = await getPageKH()
      console.log('API Response:', response)

      if (response) {
        setCustomers(response.content)
      } else {
        notification.error({
          message: 'Error',
          description: 'Failed to fetch data from API',
        })
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch data from API',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApiAllCustomer()
  }, [])

  return (
    <>
      <Row>
        <Col span={12}>
          <h5>Thông tin phiếu</h5>
        </Col>
        <Col span={12}>
          {showCustomerTable && <h5 style={{ marginLeft: '10px' }}>Danh sách khách hàng</h5>}
        </Col>
      </Row>
      <Row>
        <Col
          span={12}
          className="bg-white"
          style={{
            borderRadius: '10px',
            padding: '15px',
          }}
        >
          <Form name="create-pgg" layout="vertical" onFinish={handleSubmit} form={form}>
            <Row gutter={[20, 0]}>
              <Col span={12}>
                <Form.Item label="Mã" name={'ma'}>
                  <Input disabled={id ? true : false} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Tên phiếu" name={'ten'}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[20, 0]}>
              <Col style={{ display: 'flex' }} xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label="Loại giảm giá"
                  name={'loaiGiamGia'}
                  required={true}
                  className="w-100 "
                  rules={[{ required: true, message: 'Loại phiếu chưa có' }]}
                >
                  <Radio.Group>
                    <Radio defaultChecked={true} value={1}>
                      %
                    </Radio>
                    <Radio value={2}>VND</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label="Phạm vi"
                  name={'phamViApDung'}
                  rules={[{ required: true, message: 'Phạm vi  chưa có' }]}
                >
                  <Radio.Group onChange={(e) => handlePhamViApDungChange(e.target.value)}>
                    <Radio defaultChecked={true} value={1}>
                      Công khai
                    </Radio>
                    <Radio value={2}>Riêng tư</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[20, 0]}>
              <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item label="Số lượng phiếu" name={'soLuong'}>
                  <InputNumber className="w-100" min={0} placeholder="Không giới hạn"></InputNumber>
                </Form.Item>
              </Col>
              <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  label="Giá trị giảm"
                  name={'giaTriGiamGia'}
                  rules={[
                    {
                      required: true,
                      message: 'Giá trị phiếu chưa có',
                    },
                  ]}
                >
                  <InputNumber min={0} className="w-100 "></InputNumber>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[20, 0]}>
              <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item label="Đơn tối thiểu" name={'giaTriDonToiThieu'}>
                  <InputNumber min={0} className="w-100 " placeholder="0đ"></InputNumber>
                </Form.Item>
              </Col>
              <Col xxl={12} xl={12} lg={12} md={12} sm={24} xs={24}>
                <Form.Item label="Giá trị giảm tối đa" name={'giamToiGia'}>
                  <InputNumber
                    min={0}
                    className="w-100 "
                    placeholder="Không giới hạn"
                  ></InputNumber>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[20, 0]}>
              <Col span={12}>
                <Form.Item
                  label="Ngày bắt đầu"
                  name={'ngayBatDauForm'}
                  rules={[
                    {
                      required: true,
                      message: 'Ngày bắt đầu chưa có',
                    },
                  ]}
                >
                  <DatePicker placeholder="Bắt đầu" format={'DD/MM/YYYY'} className="w-100" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ngày kết thúc"
                  name={'ngayKetThucForm'}
                  rules={[
                    {
                      required: true,
                      message: 'Ngày kết thúc chưa có',
                    },
                  ]}
                >
                  <DatePicker placeholder="Kết thúc" format={'DD/MM/YYYY'} className="w-100" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[20, 0]}>
              <Col span={24}>
                <Form.Item label="Mô tả" name={'moTa'}>
                  <Input.TextArea></Input.TextArea>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    {id ? 'Cập nhật' : 'Tạo mới'}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col
          style={{
            marginLeft: '10px',
          }}
          span={11}
        >
          {showCustomerTable && (
            <Table
              rowSelection={{ ...rowSelection, checkStrictly: true }}
              dataSource={customers}
              columns={columns}
              pagination={false}
              rowKey={'id'}
              scroll={{ y: 500 }}
            />
          )}
        </Col>
      </Row>
    </>
  )
}

export default CreatePGG
