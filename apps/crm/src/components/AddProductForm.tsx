import { Form, Input, InputNumber, Select, Modal } from 'antd';

interface AddProductFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const categoryOptions = [
  { label: 'CRM', value: 'CRM' },
  { label: 'Analytics', value: 'Analytics' },
  { label: 'Enterprise', value: 'Enterprise' },
  { label: 'Integration', value: 'Integration' },
];

const billingCycleOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
  { label: 'One-time', value: 'one-time' },
];

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
];

export default function AddProductForm({ visible, onCancel, onSubmit }: AddProductFormProps) {
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Add New Product"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ status: 'active' }}
      >
        <Form.Item
          name="name"
          label="Product Name"
          rules={[{ required: true, message: 'Please enter the product name' }]}
        >
          <Input placeholder="Enter product name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter the product description' }]}
        >
          <Input.TextArea placeholder="Enter product description" rows={3} />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please select the product category' }]}
        >
          <Select options={categoryOptions} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please enter the product price' }]}
        >
          <InputNumber
            prefix="$"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            style={{ width: '100%' }}
            min={0}
            step={0.01}
          />
        </Form.Item>

        <Form.Item
          name="billingCycle"
          label="Billing Cycle"
          rules={[{ required: true, message: 'Please select the billing cycle' }]}
        >
          <Select options={billingCycleOptions} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select the product status' }]}
        >
          <Select options={statusOptions} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
