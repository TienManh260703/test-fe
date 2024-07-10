import { notification, Popconfirm, Table, Tag, Button, Pagination } from 'antd'
import { useEffect, useState } from 'react'

import { deletedCoupons, getPGGPage } from '../../service/phieuGiamGiaService'
import { DeleteOutlined, EditOutlined, EllipsisOutlined, SyncOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

function PGGTable() {
  const navigate = useNavigate()
  let sttCounter = 0
  const [listPhieuGiamGia, setListPhieuGiamGia] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [size, setSize] = useState(5)
  const [totalItems, setTotalItems] = useState(0)

  const [loading, setLoading] = useState(false)
  const fetchApi = async (page = currentPage, size = size) => {
    const response = await getPGGPage(page, size)
    // console.log('API Response:', response)

    if (response.status_code === 200) {
      console.log(response.data.result)
      setListPhieuGiamGia(response.data.result)
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
    const response = await deletedCoupons(id)
    if (response) {
      setLoading(!loading)
      notification.success({
        message: 'Hủy thành công',
        description: `Thông tin : ${response.ma}`,
        showProgress: true,
        duration: 2,
      })
    } else {
      notification.success({
        message: 'Thất Bại',
        description: `Thông tin : ${response.ma}`,
        showProgress: true,
        duration: 2,
      })
    }
  }

  const handleNavigate = (path, id) => {
    navigate(`/coupons/${path}/${id}`)
  }
  const columns = [
    {
      title: 'STT',
      dataIndex: 'STT',
      key: 'STT',
      render: () => {
        sttCounter += 1
        return <span>{sttCounter}</span>
      },
    },
    {
      title: 'Mã phiếu',
      dataIndex: 'ma',
      key: 'ma',
    },
    {
      title: 'Tên phiếu',
      dataIndex: 'ten',
      key: 'ten',
    },
    {
      title: 'Loại giảm giá',
      dataIndex: 'loaiGiamGia',
      key: 'loaiGiamGia',
      render: (_, { loaiGiamGia }) => (
        <>
          {loaiGiamGia == 1 ? (
            <>
              <Tag color="magenta" key={loaiGiamGia}>
                %
              </Tag>
            </>
          ) : (
            <>
              <Tag key={loaiGiamGia}>VND</Tag>
            </>
          )}
        </>
      ),
    },
    {
      title: 'Phạm vi',
      dataIndex: 'phamViApDung',
      key: 'phamViApDung',
      render: (_, { phamViApDung }) => (
        <>
          {phamViApDung == 2 ? (
            <>
              <Tag color="gold" key={phamViApDung}>
                Hệ thống
              </Tag>
            </>
          ) : (
            <>
              <Tag color="cyan" key={phamViApDung}>
                Công khai
              </Tag>
            </>
          )}
        </>
      ),
    },
    {
      title: 'Giá trị giảm',
      dataIndex: 'giaTriGiamGia',
      key: 'giaTriGiamGia',
      render: (giaTriGiamGia, record) => (
        <>
          {record.loaiGiamGia === 1
            ? `${giaTriGiamGia}%`
            : giaTriGiamGia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </>
      ),
    },

    {
      title: 'Giá trị đơn tối thiểu',
      dataIndex: 'giaTriDonToiThieu',
      key: 'giaTriDonToiThieu',
      render: (giaTriDonToiThieu) =>
        giaTriDonToiThieu !== null && giaTriDonToiThieu !== undefined
          ? giaTriDonToiThieu.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
          : '0 ₫',
    },
    {
      title: 'Giá trị giảm tối đa',
      dataIndex: 'giamToiGia',
      key: 'giamToiGia',
      render: (giamToiGia) =>
        giamToiGia !== null
          ? giamToiGia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
          : 'Không giới hạn',
    },
    {
      title: 'Bắt đầu và kết thúc',
      dataIndex: 'ngayBatDau',
      key: 'ngayBatDau',
      render: (_, record) => (
        <span style={{ whiteSpace: 'nowrap' }}>
          {new Date(record.ngayBatDau).toLocaleDateString('vi-VN')}
          {' | '}
          {new Date(record.ngayHetHan).toLocaleDateString('vi-VN')}
        </span>
      ),
    },
    // {
    //   title: 'Mô tả',
    //   dataIndex: 'moTa',
    //   key: 'moTa',
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (_, { trangThai }) => {
        let color = ''
        let text = ''

        switch (trangThai) {
          case 1:
            color = 'success'
            text = 'Đang áp dụng'
            break
          case 2:
            color = 'warning'
            text = 'Hết hạn'
            break
          case 3:
            color = 'error'
            text = 'Hủy'
            break
          default:
            color = 'default'
            text = 'Chưa đến'
        }

        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: 'Aciton',
      key: 'action',
      render: (_, recoder) => (
        <div
          style={{
            display: 'flex',
          }}
        >
          <Popconfirm title="Bạn có muốn hủy ?" onConfirm={() => handleDelete(recoder.id)}>
            {/* onConfirm={handleDelete} */}
            <Button
              disabled={recoder.trangThai === 3 ? true : false}
              danger
              size="small"
              icon={<SyncOutlined />}
            />
          </Popconfirm>

          <Button
            style={{
              marginLeft: '5px',
            }}
            size="small"
            onClick={() => handleNavigate('update', recoder.id)}
            icon={<EditOutlined />}
          ></Button>
          <Button
            style={{
              marginLeft: '5px',
            }}
            size="small"
            onClick={() => handleNavigate('customer-coupons', recoder.id)}
            icon={<EllipsisOutlined />}
          ></Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Table dataSource={listPhieuGiamGia} columns={columns} rowKey={'id'} pagination={false} />
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

export default PGGTable
