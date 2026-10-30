import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native'
import { colors, radius } from '../constants/theme'

// Ô nhập liệu có nhãn + dòng lỗi — dùng chung cho form đặt hàng và đặt lịch sửa.
export function Field({
  label,
  error,
  ...props
}: { label: string; error?: string } & TextInputProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor={colors.faint}
        style={[styles.input, props.multiline && styles.inputMultiline, error ? styles.inputError : null, props.style]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  )
}

// Nhóm chip chọn 1 giá trị (khu vực, thiết bị, khung giờ…).
export function ChipSelect({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map((opt) => {
          const active = opt === value
          return (
            <Pressable
              key={opt}
              onPress={() => onChange(opt)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{opt}</Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  fieldWrap: { gap: 6 },
  label: { fontSize: 13, fontWeight: '700', color: colors.ink },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: colors.ink,
  },
  inputMultiline: { minHeight: 84, textAlignVertical: 'top' },
  inputError: { borderColor: colors.red },
  error: { fontSize: 12, fontWeight: '500', color: colors.red },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  chipActive: { backgroundColor: colors.navy, borderColor: colors.navy },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.ink },
  chipTextActive: { color: '#fff' },
})
