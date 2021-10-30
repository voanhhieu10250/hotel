import React, { useContext, useState } from 'react';
import Button from '@iso/ui/Antd/Button/Button';
import HtmlLabel from '@iso/ui/HtmlLabel/HtmlLabel';
import DatePickerRange from '@iso/ui/DatePicker/ReactDates';
import ViewWithPopup from '@iso/ui/UI/ViewWithPopup/ViewWithPopup';
import InputIncDec from '@iso/ui/InputIncDec/InputIncDec';
import ReservationFormWrapper, {
  FormActionArea,
  FieldWrapper,
  RoomGuestWrapper,
  ItemWrapper,
} from './Reservation.style.js';
import moment from 'moment';
import { apiInstance, AuthContext } from '../../../context/AuthProvider.js';

const RenderReservationForm = ({ hotelId }) => {
  const { user, loggedIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  // form state
  const [formState, setFormState] = useState({
    startDate: null,
    endDate: null,
    room: 0,
    guest: 0,
  });

  // handle room guest increment decrement
  const handleIncrement = type => {
    setFormState({
      ...formState,
      [type]: formState[type] + 1,
    });
  };

  const handleDecrement = type => {
    if (formState[type] <= 0) {
      return false;
    }
    setFormState({
      ...formState,
      [type]: formState[type] - 1,
    });
  };

  const handleIncDecOnChnage = (e, type) => {
    let currentValue = e.target.value;

    setFormState({
      ...formState,
      [type]: currentValue,
    });
  };

  // handle date data on update
  const updateSearchDataFunc = value => {
    console.log(value);
    setFormState({
      ...formState,
      startDate: value.setStartDate,
      endDate: value.setEndDate,
    });
  };

  // handleSubmit data
  const handleSubmit = async e => {
    e.preventDefault();
    if (!loggedIn || !user) {
      alert('Please signin first then do the booking later !');
      return;
    }
    const startDate = moment.utc(formState.startDate).format();
    const endDate = moment.utc(formState.endDate).format();
    const bookerContact =
      user.cellNumber === 'adminsecret' ? '0987654321' : user.cellNumber;

    const confirmResult = window.confirm(
      `CONFIRM AND PAY:\n\nYour Eamil: ${user.email}\nYour Contact: ${bookerContact}\nStart Date: ${formState.startDate}\nEnd Date: ${formState.endDate}\nRooms: ${formState.room}\nGuests: ${formState.guest}`
    );
    if (!confirmResult) return;
    else {
      setLoading(true);
      try {
        const { data } = await apiInstance.post('booking/add-booking', {
          bookerContact: bookerContact,
          bookerEmail: user.email,
          endDate: endDate,
          guests: formState.guest,
          hotelId: hotelId,
          message: '',
          rooms: formState.room,
          startDate: startDate,
        });
        console.log(data);
        if (data.status === 201) {
          alert(
            'We have received your information. We will contact with you to confirm your payment soon.'
          );
        }
      } catch (error) {
        console.log(error);
        alert('Something went wrong. Please try again later.');
      }
      setLoading(false);
    }
  };

  return (
    <ReservationFormWrapper
      $loading={loading}
      className="form-container"
      onSubmit={handleSubmit}
    >
      <FieldWrapper>
        <HtmlLabel htmlFor="dates" content="Dates" />
        <DatePickerRange
          startDateId="checkin-Id"
          endDateId="checkout-id"
          startDatePlaceholderText="Check In"
          endDatePlaceholderText="Check Out"
          updateSearchData={value => updateSearchDataFunc(value)}
          numberOfMonths={1}
          small
        />
      </FieldWrapper>
      <FieldWrapper>
        <HtmlLabel htmlFor="guests" content="Guests" />
        <ViewWithPopup
          key={200}
          noView={true}
          className={formState.room || formState.guest ? 'activated' : ''}
          view={
            <Button type="default">
              <span>Room {formState.room > 0 && `: ${formState.room}`}</span>
              <span>-</span>
              <span>Guest{formState.guest > 0 && `: ${formState.guest}`}</span>
            </Button>
          }
          popup={
            <RoomGuestWrapper>
              <ItemWrapper>
                <strong>Room</strong>
                <InputIncDec
                  id="room"
                  increment={() => handleIncrement('room')}
                  decrement={() => handleDecrement('room')}
                  onChange={e => handleIncDecOnChnage(e, 'room')}
                  value={formState.room}
                />
              </ItemWrapper>

              <ItemWrapper>
                <strong>Guest</strong>
                <InputIncDec
                  id="guest"
                  increment={() => handleIncrement('guest')}
                  decrement={() => handleDecrement('guest')}
                  onChange={e => handleIncDecOnChnage(e, 'guest')}
                  value={formState.guest}
                />
              </ItemWrapper>
            </RoomGuestWrapper>
          }
        />
      </FieldWrapper>
      <FormActionArea>
        <Button htmlType="submit" type="primary">
          Save Changes
        </Button>
      </FormActionArea>
    </ReservationFormWrapper>
  );
};

export default RenderReservationForm;
