import React, { useState, useEffect } from 'react'
import { Button, Pagination, Popconfirm, Space, Table, Tag } from 'antd'
import { useParams } from 'react-router-dom'
import { deleteKhPGG, getKHPGGById } from '../../service/phieuGiamGiaService'
import { DeleteOutlined } from '@ant-design/icons'

function KHPGGTable() {
  let sttCounter = 0
  const { id } = useParams()
  const [customerCoupons, setCustomerCoupons] = useState([])
  const [loading, setLoading] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const [size, setSize] = useState(5)
  const [totalItems, setTotalItems] = useState(0)

  const fetchApi = async (page = currentPage, size = size) => {
    const response = await getKHPGGById(id, (page = currentPage), (size = size))
    // console.log('API Response:', response)

    if (response.status_code === 200) {
      console.log(response.data.result)
      setCustomerCoupons(response.data.result)
      setCurrentPage(response.data.meta.page + 1)
      setSize(response.data.meta.pageSize)
      setTotalItems(response.data.meta.total)
    } else {
      notification.error({
        message: 'Error',
        description: 'Failed to fetch data from API',
      })
    }
  }

  useEffect(() => {
    fetchApi(currentPage, size)
  }, [currentPage, size, loading])

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page)
    setSize(pageSize)
  }
  const handleDelete = async (id) => {
    const response = await deleteKhPGG(id, 3)
    fetchApi(currentPage, size)
    if (response) {
      notification.success({
        message: 'Thông báo',
        description: `Bạn đã chọn xóa phiếu có ID: ${id}`,
      })
    }
  }
  const columns = [
    {
      title: 'STT',
      render: () => {
        sttCounter += 1
        return <span>{sttCounter}</span>
      },
    },
    {
      title: 'Mã Phiếu',
      dataIndex: 'maPhieu',
      key: 'maPhieu',
    },
    {
      title: 'Mã Khách Hàng',
      dataIndex: 'maKhachHang',
      key: 'maKhachHang',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'sdt',
      key: 'sdt',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai) => {
        let color = ''
        let status = ''
        switch (trangThai) {
          case 0:
            status = 'Chưa sử dụng'
            color = 'default'
            break
          case 1:
            status = 'Đã sử dụng'
            color = 'success'
            break
          case 2:
            status = 'Hết hạn'
            color = 'warning'
            break
          case 3:
            status = 'Hủy'
            color = 'error'
            break
          default:
            status = 'Unknown'
            color = 'black'
            break
        }
        return <Tag color={color}>{status}</Tag>
      },
    },
    {
      title: 'Hành Động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa phiếu này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button
              disabled={record.trangThai === 3 ? true : false}
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Table
        dataSource={customerCoupons}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={false}
      />

      <Pagination
        style={{
          marginTop: '10px',
        }}
        current={currentPage}
        pageSize={size}
        total={totalItems}
        onChange={handlePageChange}
        showSizeChanger
        pageSizeOptions={['5', '10', '20']}
      />
    </>
  )
}

export default KHPGGTable
