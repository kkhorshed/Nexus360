import { Form, Input, InputNumber, Select, Modal } from 'antd';

interface AddDealFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}

const stageOptions = [
  { label: 'Qualified', value: 'Qualified' },
  { label: 'Proposal', value: 'Proposal' },
  { label: 'Negotiation', value: 'Negotiation' },
  { label: 'Closed Won', value: 'Closed Won' },
];

export default function AddDealForm({ visible, onCancel, onSubmit }: AddDealFormProps) {
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
      title="Add New Deal"
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ probability: 0 }}
      >
        <Form.Item
          name="title"
          label="Deal Title"
          rules={[{ required: true, message: 'Please enter the deal title' }]}
        >
          <Input placeholder="Enter deal title" />
        </Form.Item>

        <Form.Item
          name="company"
          label="Company"
          rules={[{ required: true, message: 'Please enter the company name' }]}
        >
          <Input placeholder="Enter company name" />
        </Form.Item>

        <Form.Item
          name="value"
          label="Deal Value"
          rules={[{ required: true, message: 'Please enter the deal value' }]}
        >
          <InputNumber
            prefix="$"
            formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            style={{ width: '100%' }}
            min={0}
          />
        </Form.Item>

        <Form.Item
          name="stage"
          label="Stage"
          rules={[{ required: true, message: 'Please select the deal stage' }]}
        >
          <Select options={stageOptions} />
        </Form.Item>

        <Form.Item
          name="probability"
          label="Probability (%)"
          rules={[{ required: true, message: 'Please enter the probability' }]}
        >
          <InputNumber min={0} max={100} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
