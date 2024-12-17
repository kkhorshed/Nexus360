import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  LinearProgress,
  Stack,
  Avatar,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { ProductCardProps } from '../types';
import { getStockColor, getStockPercentage, formatPrice } from '../utils/helpers';

export default function ProductCard({ product, onEdit }: ProductCardProps) {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      <IconButton
        size="small"
        onClick={() => onEdit(product)}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <EditIcon />
      </IconButton>

      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'secondary.main' }}>
            <InventoryIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" component="div">
              {product.name}
            </Typography>
            <Chip 
              size="small" 
              label={product.category}
              sx={{ mt: 0.5 }}
            />
          </Box>
        </Box>

        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <QrCodeIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              SKU: {product.sku}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalOfferIcon color="action" fontSize="small" />
            <Typography variant="h6" color="primary">
              {formatPrice(product.price)}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Stock Level
            </Typography>
            <LinearProgress
              variant="determinate"
              value={getStockPercentage(product.stock)}
              color={getStockColor(product.stock)}
              sx={{ height: 8 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {product.stock} units
            </Typography>
          </Box>
          {product.description && (
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
